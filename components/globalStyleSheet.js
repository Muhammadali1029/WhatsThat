import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  headerContainer: {
    borderBottomWidth: 3,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  titleContainer: {
    marginBottom: 10,
  },
  titleText: {
    fontSize: 35,
    fontWeight: '900',
    color: 'black',
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButtons: {
    color: '#0077be',
    fontSize: 18,
    fontWeight: '600',
    borderBottomWidth: 2,
    borderBottomColor: '#0077be',
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
