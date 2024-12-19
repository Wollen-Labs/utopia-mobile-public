import { Button } from 'components/Button';
import { FONTS } from 'constants/fonts';
import { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from 'utils/supabase';
import { AuthStackScreenProps } from '../../navigation/types';

type Props = AuthStackScreenProps<'Login'>;

export default function Login({ navigation }: Props) {
  const [emailOrPhone, setEmailOrPhone] = useState('18005550123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const isEmail = emailOrPhone.includes('@');
      console.log(isEmail, emailOrPhone);
      const { error } = await supabase.auth.signInWithOtp({
        ...(isEmail ? { email: emailOrPhone } : { phone: emailOrPhone }),
      });

      if (error) throw error;

      navigation.navigate('Verify', {
        type: isEmail ? 'email' : 'sms',
        contact: emailOrPhone,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('assets/utopia-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email or mobile number"
            placeholderTextColor="#666666"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            autoCapitalize="none"
            keyboardType={emailOrPhone.includes('@') ? 'email-address' : 'phone-pad'}
          />
        </View>
        <Button
          title="Log In"
          onPress={handleLogin}
          disabled={loading || !emailOrPhone}
          style={[styles.button, (loading || !emailOrPhone) && styles.buttonDisabled]}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.poweredBy}>POWERED BY</Text>
        <Text style={styles.poweredByLogo}>utopia</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#000000',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    fontFamily: FONTS.LIGHT,
    color: '#FFFFFF',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    fontFamily: FONTS.REGULAR,
    backgroundColor: '#101010',
    borderRadius: 10,
    padding: 15,
    color: '#8A8A8A',
    fontSize: 16,
    borderColor: '#1C1C1C',
    borderWidth: 0.5,
  },
  button: {
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  poweredBy: {
    fontFamily: FONTS.MEDIUM,
    color: '#666666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 4,
  },
  poweredByLogo: {
    fontFamily: FONTS.LIGHT,
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    padding: 40,
    alignItems: 'center',
    width: '100%',
  },
});
