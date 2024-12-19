import { FONTS } from 'constants/fonts';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { supabase } from 'utils/supabase';

import { AuthStackScreenProps } from '../../navigation/types';

type Props = AuthStackScreenProps<'Verify'>;

export default function Verify({ route, navigation }: Props) {
  const { type, contact } = route.params;
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (code.every((digit) => digit !== '')) {
      handleVerify();
    }
  }, [code]);

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        token: code.join(''),
        ...(type === 'sms' ? { type: 'sms', phone: contact } : { type: 'email', email: contact }),
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setCode(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        ...(type === 'sms' ? { phone: contact } : { email: contact }),
      });

      if (error) throw error;
      setCode(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Please enter the code we sent you</Text>
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={[styles.codeInput, loading && styles.codeInputDisabled]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              editable={!loading}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleResendCode} disabled={loading}>
          <Text style={styles.resendText}>
            Didn't receive a code?{'  '}
            <Text style={[styles.resendLink, loading && styles.resendLinkDisabled]}>
              Resend Code
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  backButtonText: {
    fontFamily: FONTS.MEDIUM,
    color: '#FFFFFF',
    fontSize: 24,
  },
  title: {
    fontFamily: FONTS.SEMI_BOLD,
    color: '#FFFFFF',
    fontSize: 32,
    marginBottom: 30,
  },
  subtitle: {
    fontFamily: FONTS.REGULAR,
    color: '#666666',
    fontSize: 16,
    marginBottom: 40,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  codeInput: {
    fontFamily: FONTS.MEDIUM,
    width: 60,
    height: 60,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#101010',
    borderRadius: 10,
    color: '#8A8A8A',
    borderColor: '#1C1C1C',
    borderWidth: 0.5,
  },
  codeInputDisabled: {
    opacity: 0.5,
  },
  resendText: {
    fontFamily: FONTS.REGULAR,
    color: '#666666',
    fontSize: 14,
    textAlign: 'left',
    width: '100%',
  },
  resendLink: {
    fontFamily: FONTS.MEDIUM,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
});
