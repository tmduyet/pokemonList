import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
  RefreshControl,
} from "react-native";
import { styles } from "./Styles";
import { GET_POKEMON, GET_TYPE } from "./Api/Containts";
import CustomButton from "./Components/CustomButton/CustomButton";
import Item from "./Components/Item/Item";
const LIMIT = 10;
interface Type {
  name: string;
  url: string;
  isSelected: boolean;
}
interface Pokemon {
  id: number;
  name: string;
  sprite: string;
}

export default function App() {
  const [typeList, setTypeList] = useState<Type[]>([]);
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [total, setTotal] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchArr, setSearchArr] = useState<string[]>([]);

  const fadeAnim = useRef(new Animated.Value(250)).current;
  const flatRef = useRef(null);
  var timeTrigger = useRef<ReturnType<typeof setTimeout>>(null);
  useEffect(() => {
    getTypeData();
  }, []);

  useEffect(() => {
    setLoading(true);
    if (searchArr.length == 0) {
      getPokemonData("");
    } else {
      getPokemonData(handleString(searchArr));
    }
  }, [searchArr]);

  const handleString = (data: string[]) => {
    return data.join(",");
  };
  const handleOnpress = (type: Type, index: number) => {
    let temp = [...typeList];
    let tempArr = [...searchArr];
    temp[index].isSelected = !temp[index].isSelected;
    let searchIndex = tempArr.findIndex((x) => x == temp[index].name);
    if (searchIndex != -1) {
      tempArr.splice(searchIndex, 1);
    } else {
      tempArr.push(temp[index].name);
    }
    setSearchArr(tempArr);
    setTypeList(temp);
  };
  const getTypeData = async () => {
    let type = await fetch(GET_TYPE).then((res) => res.json());
    if (type)
      setTypeList(
        type.results.map((x: Type) => {
          return { ...x, isSelected: false };
        })
      );
  };

  const getPokemonData = async (type: string) => {
    let pokemon = await fetch(
      GET_POKEMON + `?limit=${LIMIT}&offSet=${0}&types=${type}`
    ).then((res) => res.json());
    if (pokemon) {
      setTotal(pokemon.length);
      setPokemonData(pokemon.data);
      setLoading(false);
    }
  };

  const handleReachEnd = () => {
    if (loadMore == false && pokemonData.length < total) {
      setLoadMore(true);
      setTimeout(async () => {
        let newPoke = await fetch(
          GET_POKEMON +
            `?limit=${LIMIT}&offSet=${
              pokemonData.length + 30
            }&types=${handleString(searchArr)}`
        ).then((res) => res.json());
        setPokemonData([...pokemonData, ...newPoke.data]);

        setLoadMore(false);
      }, 1000);
    }
  };

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 250,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getPokemonData(handleString(searchArr));
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [refreshing, getPokemonData]);
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.filterContainer, { height: fadeAnim }]}>
        <Text style={{ fontWeight: "bold" }}>Type:</Text>
        {typeList &&
          typeList.length > 0 &&
          typeList.map((type, index) => (
            <CustomButton
              style={{
                ...(type.isSelected && { backgroundColor: "crimson" }),
              }}
              textStyle={{
                ...(type.isSelected && { color: "#fff" }),
              }}
              onPress={() => handleOnpress(type, index)}
              key={`i_${index}`}
              title={type.name}
            ></CustomButton>
          ))}
      </Animated.View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold", marginHorizontal: 10 }}>
          {total} results found.
        </Text>
        {loading ? (
          <Text>Loading</Text>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              ></RefreshControl>
            }
            ref={flatRef}
            ListEmptyComponent={() => (
              <View>
                <Text>No results found.</Text>
              </View>
            )}
            onScrollBeginDrag={() => {
              fadeOut();
              clearTimeout(timeTrigger.current);
            }}
            onScrollEndDrag={() => {
              timeTrigger.current = setTimeout(() => {
                fadeIn();
              }, 2000);
            }}
            data={pokemonData}
            contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}
            keyExtractor={(item, index) => `${item.name}_${index}`}
            renderItem={({ item, index }) => {
              return <Item item={item} index={index}></Item>;
            }}
            showsVerticalScrollIndicator={false}
            onEndReached={handleReachEnd}
            scrollEventThrottle={0.1}
            extraData={pokemonData}
            numColumns={2}
            ListFooterComponent={() => (
              <View style={{ height: 20, width: "100%" }}>
                {loadMore ? (
                  <ActivityIndicator></ActivityIndicator>
                ) : (
                  pokemonData.length >= total && <Text>End</Text>
                )}
              </View>
            )}
          ></FlatList>
        )}
      </View>
    </SafeAreaView>
  );
}
