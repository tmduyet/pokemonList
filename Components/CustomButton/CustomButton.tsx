import React from 'react'
import { Pressable,Text } from 'react-native';
import { styles } from './Styles';

type Props = {
    title:string;
    onPress:()=>void;
    style:object,
    textStyle:object
}

const CustomButton = (props: Props) => {
  return (
    <Pressable onPress={props.onPress} style={[styles.buttonContainer,props.style]}>
        <Text style={[styles.textStyles,props.textStyle]}>{props.title}</Text>
    </Pressable>
  )
}

export default CustomButton