import { StyleSheet,Dimensions } from "react-native";
const {width,height} = Dimensions.get('window')
export const styles = StyleSheet.create({
  itemContainer: {
    height: height / 4,
    width: width / 2 - 20,
    backgroundColor: "#d3d3d3",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 20,
  },
  img: {
    height: height / 4 - 40,
    width: width / 2 - 30,
  },
  txtName:{
    width:'100%',
    textAlign:'center',
    fontWeight:'bold'
  }
});
