import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewProps,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../../../../constants/colors';
import { Constants } from '../../../../../constants';
import { Fonts } from '../../../../../constants/fonts';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import useManager from '../../../../../hooks/useManager';
import withObservables from '@nozbe/with-observables';
import ContactModel from '../../../../../database/models/contact';

interface IProps extends ViewProps {
  data: IContactProps;
  contact: ContactModel;
}

export const Contact: React.FC<IProps> = ({ data, contact }) => {
  const { contacts } = useManager();

  function _remove() {
    Alert.alert(
      contact.name,
      'Deseja remover este contato?',
      [
        {
          text: 'Não',
          onPress: () => console.log('No, continue editing'),
        },
        {
          style: 'cancel',
          text: 'Sim',
          onPress: () => contacts.remove(data.contact_id),
        },
      ],
      { cancelable: false },
    );
  }

  return (
    <TouchableOpacity onPress={_remove} style={{ alignItems: 'center' }}>
      <MaterialCommunityIcons
        name={Constants.CONTACT_PHYSICAL_ICON as any}
        size={Constants.CARD_ICON_SIZE / 2}
        color="white"
        style={styles.iconContainer}
      />
      <Text numberOfLines={1} style={styles.label}>
        {contact.name}
      </Text>
    </TouchableOpacity>
  );
};

export const ObservedContact = withDatabase(
  withObservables(['database', 'data'], ({ database, data }) => ({
    contact: database.get('contacts').findAndObserve(data.contact_id),
  }))(Contact),
);

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: Colors.green,
    padding: Constants.CARD_ICON_SIZE / 4,
    borderRadius: Constants.CARD_ICON_SIZE,
  },
  label: {
    fontFamily: Fonts.text,
    fontSize: 9,
    color: Colors.heading,
    marginTop: 2.4,
    maxWidth: 40,
  },
});
