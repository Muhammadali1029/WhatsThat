import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 35,
    fontWeight: '800',
    color: 'black',
  },
  backgroundOveride:
    {
      backgroundColor: 'white',
    },
  textInput:
    {
      height: 40,
      borderWidth: 2,
      borderColor: '#505054',
      borderRadius: 10,
      width: '100%',
    },
  text:
    {
      color: 'white',
      fontSize: 15,
    },
  buttonContainer: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
