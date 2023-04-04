import { StyleSheet} from "react-native"


export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    width: "100%",
    paddingHorizontal:10,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems:'baseline',
    overflow:'hidden'
  },
  scrollContainer:{
    maxHeight:150
  },
});