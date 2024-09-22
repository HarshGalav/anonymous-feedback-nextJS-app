import { Html, Head, Body, Container, Text, Button } from '@react-email/components';
import * as React from 'react';

interface VerificationEmailProps {
    username:string;
  otp: string;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({ username,otp }) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Verify Your Email</Text>
          <Text style={paragraph}>
            Thank you {username} for signing up. Please use the following OTP to verify your email address:
          </Text>
          <Text style={otpStyle}>{otp}</Text>
          <Text style={paragraph}>
            If you didn't request this, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
};

const paragraph = {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#484848',
};

const otpStyle = {
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#007bff',
  textAlign: 'center' as const,
  margin: '30px 0',
};