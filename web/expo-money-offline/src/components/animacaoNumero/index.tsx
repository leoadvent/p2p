import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import {
    runOnJS,
    useAnimatedReaction,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

interface AnimatedNumberProps {
  toValue: number;
  duration?: number;
  prefix?: string;
  fontSize?: number;
  color?: string;
}

export function AnimatedNumber({
  toValue,
  duration = 1000,
  prefix = 'R$ ',
  fontSize = 14,
  color = 'black',
}: AnimatedNumberProps) {
  const progress = useSharedValue(0);
  const [displayed, setDisplayed] = useState('R$ 0,00');

  useEffect(() => {
    progress.value = withTiming(toValue, { duration });
  }, [toValue]);

  useAnimatedReaction(
    () => progress.value,
    (currentValue) => {
      const formatted =  Number(currentValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });//`${prefix}${currentValue.toFixed(2).replace('.', ',')}`;
      runOnJS(setDisplayed)(formatted);
    },
    [prefix]
  );

  return <Text style={{ fontSize, color }}>{displayed}</Text>;
}
