import React, { useEffect, useRef } from 'react';
import { remote, ipcRenderer } from 'electron';
import { ThemeProps } from 'react-uwp';
import PasswordBox from 'react-uwp/PasswordBox';
import styled from 'styled-components';

const OTPLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const OTPWindow: React.FC<ThemeProps> = () => {
  const otpRef = useRef<PasswordBox>(null);
  let otpEntered: boolean = false;

  useEffect(() => {
    if (otpRef && otpRef.current) {
      otpRef.current?.textBox.inputElm.focus();
    }
    remote.getCurrentWindow().on('close', () => {
      if (!otpEntered) {
        ipcRenderer.send('request-logout', true);
      }
    });
  }, [otpEntered]);

  const sendOTP = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      otpEntered = true;
      const otpData = otpRef.current!.getValue();
      ipcRenderer.send('request-otp', otpData);
      remote.getCurrentWindow().close();
    }
  };

  return (
    <OTPLayout>
      <span>
        OTP가 있어요 !
      </span>
      <PasswordBox
        placeholder="OTP 숫자"
        defaultShowPassword
        style={{
          height: '2rem',
          width: '120px',
        }}
        ref={otpRef}
        onKeyPress={sendOTP}
      />
    </OTPLayout>
  );
};

export default OTPWindow;
