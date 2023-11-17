import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';

export default function ChatMessage() {

  function editMessage() {
    Alert.alert(
      "Editar ou deletar?",
      "Escolha uma opção:",
      [
        {
          text: "Editar",
          onPress: () => {
            setIsEditing(true);
          }
        },
        {
          text: "Deletar",
          onPress: () => {
            deleteMessage()
          }
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );
  }

  async function updateMessage() {
  }

  async function deleteMessage() {
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => editMessage()}>
        <View style={[styles.messageBox, {
          borderBottomWidth: 1,
        }
        ]}
        >
          <Text style={styles.name}>displayName</Text>
          
          <Text style={styles.message}>mensagem</Text>

          <Text style={styles.hour}>hora</Text>

        </View>
      </TouchableOpacity>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  messageBox: {
    borderRadius: 5,
    padding: 10
  },
  name: {
    color: '#F53745',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  hour:{
    marginLeft: 280,
    fontSize: 10
  }
});