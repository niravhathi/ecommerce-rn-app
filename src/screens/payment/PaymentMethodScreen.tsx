import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";

type Card = {
  id: string;
  brand: "mastercard" | "visa";
  holder: string;
  number: string;
  expiry: string;
  cvv: string;
};

type Transaction = {
  id: string;
  date: string;
  orderId: string;
  amount: number;
};

const PaymentMethodScreen = () => {
  const [cards, setCards] = useState<Card[]>([
    {
      id: "1",
      brand: "mastercard",
      holder: "AMANDA MORGAN",
      number: "**** **** **** 1579",
      expiry: "12/22",
      cvv: "123",
    },
  ]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const transactions: Transaction[] = [
    { id: "1", date: "April.19 2020 12:31", orderId: "#92287157", amount: -14 },
    { id: "2", date: "April.19 2020 12:31", orderId: "#92287157", amount: -37 },
    { id: "3", date: "April.19 2020 12:31", orderId: "#92287157", amount: -21 },
    { id: "4", date: "April.19 2020 12:31", orderId: "#92287157", amount: -75 },
    {
      id: "5",
      date: "April.19 2020 12:31",
      orderId: "#92287157",
      amount: -214,
    },
    { id: "6", date: "April.19 2020 12:31", orderId: "#92287157", amount: -53 },
  ];

  const handleSave = () => {
    if (!form.holder || !form.number || !form.expiry || !form.cvv) {
      Alert.alert("All fields are required.");
      return;
    }

    if (editing && selectedCard) {
      setCards((prev) =>
        prev.map((card) =>
          card.id === selectedCard.id
            ? {
                ...card,
                ...form,
                number: "**** **** **** " + form.number.slice(-4),
              }
            : card
        )
      );
    } else {
      const newCard: Card = {
        id: Date.now().toString(),
        brand: "visa",
        holder: form.holder,
        number: "**** **** **** " + form.number.slice(-4),
        expiry: form.expiry,
        cvv: form.cvv,
      };
      setCards((prev) => [...prev, newCard]);
    }

    setShowModal(false);
    setForm({ holder: "", number: "", expiry: "", cvv: "" });
    setEditing(false);
    setSelectedCard(null);
  };

  const handleEdit = (card: Card) => {
    setForm({
      holder: card.holder,
      number: card.number.slice(-4),
      expiry: card.expiry,
      cvv: card.cvv,
    });
    setEditing(true);
    setSelectedCard(card);
    setShowModal(true);
  };

  const handleDelete = () => {
    if (selectedCard) {
      setCards((prev) => prev.filter((card) => card.id !== selectedCard.id));
      setShowModal(false);
      setEditing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <Text style={styles.subHeader}>Payment Methods</Text>

      <FlatList
        horizontal
        data={cards}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardBrand}>
              {item.brand === "mastercard" ? "MasterCard" : "VISA"}
            </Text>
            <Text style={styles.cardNumber}>{item.number}</Text>
            <Text style={styles.cardHolder}>{item.holder}</Text>
            <Text style={styles.cardExpiry}>{item.expiry}</Text>
            <TouchableOpacity
              style={styles.cardEdit}
              onPress={() => handleEdit(item)}
            >
              <MaterialIcons name="cog-outline" size={20} color="#555" />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditing(false);
              setForm({ holder: "", number: "", expiry: "", cvv: "" });
              setShowModal(true);
            }}
          >
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        }
      />

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.transaction,
              { backgroundColor: item.amount < 0 ? "#f0f2ff" : "#e0ffe0" },
            ]}
          >
            <Icon
              name={
                item.amount < 0 ? "lock-closed-outline" : "lock-open-outline"
              }
              size={20}
              color={item.amount < 0 ? "#226" : "green"}
            />
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionDate}>{item.date}</Text>
              <Text style={styles.transactionOrder}>Order {item.orderId}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                {
                  color: item.amount < 0 ? "#d00" : "green",
                },
              ]}
            >
              {item.amount < 0 ? "" : "+"}${Math.abs(item.amount).toFixed(2)}
            </Text>
          </View>
        )}
      />

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editing ? "Edit Card" : "Add Card"}
            </Text>

            {editing && (
              <TouchableOpacity
                style={{ alignSelf: "flex-end", marginBottom: 5 }}
                onPress={handleDelete}
              >
                <MaterialIcons name="delete-outline" size={24} color="red" />
              </TouchableOpacity>
            )}

            <TextInput
              placeholder="Card Holder"
              value={form.holder}
              onChangeText={(text) => setForm((f) => ({ ...f, holder: text }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Card Number"
              keyboardType="numeric"
              value={form.number}
              onChangeText={(text) => setForm((f) => ({ ...f, number: text }))}
              style={styles.input}
            />
            <View style={styles.row}>
              <TextInput
                placeholder="Valid"
                value={form.expiry}
                onChangeText={(text) =>
                  setForm((f) => ({ ...f, expiry: text }))
                }
                style={[styles.input, { flex: 1, marginRight: 10 }]}
              />
              <TextInput
                placeholder="CVV"
                value={form.cvv}
                onChangeText={(text) => setForm((f) => ({ ...f, cvv: text }))}
                style={[styles.input, { flex: 1 }]}
                secureTextEntry
              />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold" },
  subHeader: { fontSize: 16, marginVertical: 10 },
  card: {
    backgroundColor: "#eef0ff",
    padding: 15,
    borderRadius: 12,
    marginRight: 12,
    width: 250,
    position: "relative",
  },
  cardBrand: { fontWeight: "bold", fontSize: 18, marginBottom: 8 },
  cardNumber: { fontSize: 16, marginBottom: 4 },
  cardHolder: { fontSize: 14, color: "#444" },
  cardExpiry: { fontSize: 12, color: "#666" },
  cardEdit: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  addButton: {
    width: 50,
    height: 100,
    backgroundColor: "#0056ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  addIcon: { color: "#fff", fontSize: 24 },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  transactionDetails: { flex: 1, marginLeft: 10 },
  transactionDate: { fontSize: 12, color: "#555" },
  transactionOrder: { fontWeight: "bold" },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#f9fafe",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#e9edff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#0056ff",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default PaymentMethodScreen;
