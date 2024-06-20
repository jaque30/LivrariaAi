import { useState } from 'react';
import {
  StyleSheet, Text, View, StatusBar, TextInput, Platform, Pressable, ScrollView,
  ActivityIndicator, Alert, Keyboard
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const statusBarHeight = StatusBar.currentHeight;
const KEY_GPT = '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';

export default function App() {
  const [genero, setGenero] = useState("");
  const [quantidade, setQuantidade] = useState(3); // Inicializa com 3 livros
  const [loading, setLoading] = useState(false);
  const [catalogo, setCatalogo] = useState(""); // Estado para o catálogo de livros

  async function handleGenerate() {
    if (genero === "") {
      Alert.alert("Atenção", "Preencha o nome do gênero escolhido!");
      return;
    }

    setCatalogo("");
    setLoading(true);
    Keyboard.dismiss();

    const prompt = `Crie um catálogo de ${quantidade.toFixed(0)} livros do gênero ${genero}. Para cada livro, inclua o título, autor, data de publicação e uma breve sinopse.`;

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY_GPT}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7, // Ajuste a temperatura para variar a criatividade da resposta
        max_tokens: 1000, // Ajuste o número máximo de tokens para controlar o tamanho da resposta
        top_p: 1,
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data.choices[0].message.content);
        setCatalogo(data.choices[0].message.content);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F1" />
      <Text style={styles.heading}>Livraria AI</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Gênero escolhido</Text>
        <TextInput
          placeholder="Ex: Fantasia, Romance, etc."
          style={styles.input}
          value={genero}
          onChangeText={(text) => setGenero(text)}
        />

        <Text style={styles.label}>Quantidade de livros: <Text style={styles.slider}> {quantidade.toFixed(0)} </Text> livros</Text>
        <Slider
          style={styles.slider} // Adicione um estilo para o slider
          minimumValue={1}
          maximumValue={7} // Ajuste o valor máximo da quantidade de livros
          minimumTrackTintColor="#009688"
          maximumTrackTintColor="#000000"
          value={quantidade}
          onValueChange={(value) => setQuantidade(value)}
        />
      </View>

      <Pressable style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Iniciar busca</Text>
        <MaterialIcons name="search" size={24} color="#FFF" />
      </Pressable>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4, }} style={styles.containerScroll} showsVerticalScrollIndicator={false} >
        {loading && (
          <View style={styles.content}>
            <Text style={styles.title}>Carregando catálogo...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {catalogo && (
          <View style={styles.content}>
            <Text style={styles.title}>Livros encontrados:</Text>
            <Text style={{ lineHeight: 24, }}>{catalogo}</Text>
          </View>
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1EF',
    alignItems: 'center',
    paddingTop: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 54
  },
  form: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'black',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#FFF',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  },
  slider: {
    marginBottom: 20,
    height: 40, // Define a altura do slider
    backgroundColor: '#f1f1f1' // Adicione margem inferior ao slider
  }
});