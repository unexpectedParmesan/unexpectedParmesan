var React = require('react-native');
var styles = require('./browse.styles.js')
var {
  Text,
  View,
  } = React;

class Browse extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>Browse View</Text>
      </View>
    )
  }
}

module.exports = Browse;