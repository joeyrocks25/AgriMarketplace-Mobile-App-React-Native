import React from "react";
import { StyleSheet, View, FlatList, Image, Text } from "react-native";
import { ListItem, ListItemSeparator } from "../components/lists";
import colors from "../config/colors";
import Icon from "../components/Icon";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import useAuth from "../auth/useAuth";

const menuItems = [
  {
    title: "My Profile",
    icon: {
      name: "account-circle",
      backgroundColor: colors.medium,
    },
    targetScreen: routes.USER_PROFILE,
  },
  {
    title: "My Listings",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.medium,
    },
    targetScreen: routes.USER_LISTINGS,
  },
  {
    title: "Saved Listings",
    icon: {
      name: "bookmark",
      backgroundColor: colors.medium,
    },
    targetScreen: routes.SAVED_LISTINGS,
  },
];

function CustomAvatar({ imageUri, name, email }) {
  console.log("image uri", imageUri)
  return (
    <View style={styles.container2}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: imageUri }} style={styles.avatar} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
    </View>
  );
}

function AccountScreen({ navigation }) {
  const { user, logOut } = useAuth();

  console.log("user = ",user)

  return (
    <Screen style={styles.screen}>
      <View style={styles.container1}>
        <CustomAvatar
          imageUri={user.profileImage}
          name={user.name}
          email={user.email}
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() => navigation.navigate(item.targetScreen)}
            />
          )}
        />
      </View>
      <ListItem
        title="Log Out"
        IconComponent={
          <Icon name="logout" backgroundColor={colors.middle_orange} />
        }
        onPress={() => logOut()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: colors.light,
  },
  container1: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 4,
    // borderRadius: 18,
    // borderColor: colors.black,
    // borderWidth: 1,
  },
  container2: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  avatarContainer: {
    borderColor: colors.middle_orange,
    borderWidth: 2,
    borderRadius: 50,
    overflow: "hidden",
    width: 80,
    height: 80,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  textContainer: {
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: colors.medium,
  },
});

export default AccountScreen;
