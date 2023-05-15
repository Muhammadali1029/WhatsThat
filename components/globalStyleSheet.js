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
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#ff6347',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
