import React, { memo, useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { styles } from "./Styles";
type ItemProps = {
  name: string;
  sprite: string;
  id: number;
};
type Props = {
  item: ItemProps;
  index: number;
};
const Item = (props: Props) => {
  return (
    <View style={styles.itemContainer}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image style={styles.img} source={{ uri: props.item.sprite }} />
        <Text style={styles.txtName}>{props.item.name}</Text>
      </View>
    </View>
  );
};

export default memo(Item);
