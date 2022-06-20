import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import LanguageContent, { Languages } from '../../@maps/Language';
import { CurrencyList } from '../../@maps/Currency';
import { Constants } from '../../constants';
import { Fonts } from '../../constants/fonts';
import { Colors } from '../../constants/colors';
import { InputSelect } from '../../components/Select/Input';
import { LabelOptions } from '../../components/Select/Components/Label';
import { CustomButton } from '../../components/CustomButton';
import { KeyboardAvoidingWrapper } from '../../components/KeyboardAvoidingWrapper';
import { Header } from '../../components/Header';
import { AnimatedIcon } from '../../utils/container';

import GroupInput from '../../components/Input';
import useAuth from '../../hooks/useAuth';

export function SettingScreen() {
  const { user, settings, setSettings } = useAuth();

  function help() {
    return Alert.alert(
      '',
      'Encontre informações sobre a sua conta e configurações do aplicativo.',
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header icon="help-circle" title="Ajustes" onPress={help} />
      <KeyboardAvoidingWrapper contentContainerStyle={{ paddingBottom: 15 }}>
        <View style={styles.iconBackground}>
          <AnimatedIcon
            name={Constants.SETTINGS_ICON as any}
            size={Constants.PAGE_ICON_SIZE}
            color={Colors.green}
          />
        </View>
        <View>
          <GroupInput
            editable={false}
            value={user.username}
            placeholder="Usuário"
            rightComponent={<CustomButton icon="account" />}
          />
          <GroupInput
            editable={false}
            value={user.email}
            placeholder="E-mail"
            rightComponent={<CustomButton icon="at" />}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.category}>
          <Text style={styles.title}>Idioma</Text>
          <InputSelect
            text={LanguageContent(settings.language).name}
            defaultValue={settings.language}
            data={Languages}
            onChangeSelect={language => setSettings({ ...settings, language })}
            OptionComponent={LabelOptions}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.category}>
          <Text style={styles.title}>Moeda</Text>
          <InputSelect
            text={settings.currency}
            defaultValue={settings.currency}
            data={CurrencyList}
            onChangeSelect={currency => setSettings({ ...settings, currency })}
            OptionComponent={LabelOptions}
          />
        </View>
      </KeyboardAvoidingWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    fontSize: 14,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.heading,
    color: Colors.heading,
  },
  category: {
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    width: '100%',
    height: 15,
  },
  iconBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 160,
    backgroundColor: '#f9f9fa',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
});
