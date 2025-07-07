import { Picker } from '@react-native-picker/picker';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { textColorError, textColorPrimary, textColorSecondary } from '../../constants/colorsPalette ';
import TextComponent from '../text/text';

interface OPTIONS {
  label: string;
  value: string;
  default?: boolean;
}

interface PROPS {
  inputError: boolean;
  label: string;
  width: number;
  options: OPTIONS[];
  selecionado: Dispatch<SetStateAction<string>>; // ← recebe o setModalidade do pai
}

export default function MeuSelect({ inputError, label, options, selecionado, width }: PROPS) {
  const defaultOption = options.find(o => o.default) || options[0];
  const [modalidade, setModalidade] = useState(defaultOption?.value ?? '');

  function handlerPicerItem() {
    return options.map((item) => (
      <Picker.Item
        key={item.value}
        label={item.label}
        value={item.value}
        color={textColorSecondary}
      />
    ));
  }

  return (
    <View style={styles(width).container}>
      <TextComponent
        color={inputError ? textColorError : textColorPrimary}
        fontSize={12}
        text={label}
        textAlign="left"
      />
      <View style={styles(width).pickerWrapper}>
        <Picker
          selectedValue={modalidade}
          onValueChange={(itemValue) => {
            setModalidade(itemValue);         // atualiza local
            selecionado(itemValue);           // envia valor para o pai
          }}
          style={styles(335).picker}
        >
          {handlerPicerItem()}
        </Picker>
      </View>
    </View>
  );
}

const styles = (width: number) => StyleSheet.create({
  container: { padding: 0, width: width },
  pickerWrapper: {
    borderWidth: 1,
    backgroundColor: 'rgb(255, 255, 255)',
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: { height: 50, backgroundColor: 'transparent', borderRadius: 25 },
});
