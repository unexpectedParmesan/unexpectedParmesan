'use strict';

var React = require('react-native');
var styles = require('./main.styles.js')
var FBLoginManager = require('NativeModules').FBLoginManager

var {
  TabBarIOS,
  NavigatorIOS,
  View,
} = React;

var Browse = require('../Browse/browse.index.js');
var Map = require('../Map/map.index.js');
var Create = require('../Create/create.index.js');
var Profile = require('../Profile/profile.index.js');
var Message = require('../Message/message.index.js');
var CurrentQuest = require('../CurrentQuest/currentQuest.index.js');

// var baseUrl = 'https://waypointserver.herokuapp.com';

class Main extends React.Component {
  // Default view is 'browse'
  constructor (props) {
    console.log('props passed into main: ', props);
    // console.log('user passed into main: ', props.user);
    super(props);
    this.state = {
      selectedTab: props.selectedTab,
      user: props.user,
      currentQuest: null,
      handleLogout: props.handleLogout,
      // baseUrl: 'http://127.0.0.1:3000'
    };
  } // end of constructor()

  handleLogout () {
    this.props.onLogout();
  }

  // - When a tab is clicked on the TabBar, the tab calls the corresponding function which will render that scene.
  render () {
    return (
      <TabBarIOS
        style={styles.tabBar}
        selectedTab={this.state.selectedTab}>

        <TabBarIOS.Item
          style={styles.description}
          selected={this.state.selectedTab === 'browse'}
          title="Browse"
          onPress={ ()=> {
            if (this.state.selectedTab === 'browse'){
              this.refs.BrowseRef.popToTop();
            } else {
              this.setSelectedTab('browse');
            }
          }}>
          {this.renderBrowseView()}
        </TabBarIOS.Item>

        <TabBarIOS.Item
          style={styles.description}
          selected={this.state.selectedTab === 'quest'}
          title="Quest"
          onPress={ ()=> {
            if (this.state.selectedTab === 'quest') {
              this.refs.QuestRef.popToTop();
            } else {
              this.setSelectedTab('quest');
            }
          }}>
          {this.renderQuestView()}
        </TabBarIOS.Item>


        <TabBarIOS.Item
          style={styles.description}
          selected={this.state.selectedTab === 'profile'}
          title="Profile"
          onPress={ ()=> {
            if (this.state.selectedTab === 'profile') {
              this.refs.ProfileRef.popToTop();
            } else {
              this.setSelectedTab('profile');
            }
          }}>
          {this.renderProfileView()}
        </TabBarIOS.Item>

      </TabBarIOS>
    )
  } // end of render()

        // MOVING THIS ASIDE FOR NOW

        // <TabBarIOS.Item
        //   selected={this.state.selectedTab === 'create'}
        //   title="Create"
        //   onPress={ ()=> {
        //     if (this.state.selectedTab === 'create') {
        //       this.refs.CreateRef.popToTop();
        //     } else {
        //       this.setState({
        //         selectedTab: 'create'
        //       });
        //     }
        //   }}>
        //   {this.renderCreateView()}
        // </TabBarIOS.Item>

  // Passed into child components so that clicking on Start Quest or Resume Quest in detail view
  // sets that chosen quest to be the user's current quest.
  setCurrentQuest(questData) {
    console.log('setting current quest: ', questData);
    this.setState({ currentQuest: questData }, () => {
      if (this.refs.QuestRef) {
        var newRoute = {
          title: 'Current Quest',
          backButtonTitle: ' ',
          component: Map,
          passProps: { quest: this.state.currentQuest, 
                       numWaypoints: this.state.currentQuest.waypoints.length,
                       currentIndex: this.state.currentQuest.current_waypoint_index || 0,
                       url: this.props.baseUrl,
                       message: '' }
        }
        this.refs.QuestRef.replace(newRoute);
      }
    });
  }

  setSelectedTab(selection) {
    console.log('setting selected tab: ', selection);
    this.setState({ selectedTab: selection }, () => {
      console.log('new state after setting tab: ', this.state);
    });
  }

  // renders the Browse Quests list
  renderBrowseView(){
    console.log('rendering browse view');
    console.log('baseUrl: ', this.props.baseUrl);
    return (
      <NavigatorIOS
        style={styles.wrapper}
        ref="BrowseRef"
        initialRoute={{
          title: 'Browse Quests',
          backButtonTitle: ' ',
          component: Browse,
          passProps: { ref: this.refs, 
                       user: this.props.user, 
                       url: this.props.baseUrl + 'quests', 
                       baseUrl: this.props.baseUrl, 
                       type: 'browse',
                       setCurrentQuest: this.setCurrentQuest.bind(this),
                       setSelectedTab: this.setSelectedTab.bind(this) }
        }}/>
    )
  } // end of renderBrowseView()

  // // renders the Create view
  // renderCreateView(){
  //   return (
  //     <NavigatorIOS
  //       style={styles.wrapper}
  //       ref="CreateRef"
  //       initialRoute={{
  //         title: 'Create Quest',
  //         backButtonTitle: ' ',
  //         component: Create,
  //         passProps: { test: "HEYA! I'M THE CREATE VIEW!! "}
  //       }}/>
  //   )
  // } // end of renderCreateView()

  renderQuestView() {

    // if (this.state.currentQuest) {

    // } else {
    //   return (
    //     <View style={styles.centering}>
    //      <Text>Go to Profile or Browse to start or resume a quest.</Text>
    //     </View>
    //   );
    // }
    var component = this.state.currentQuest ? Map : Message;
    var currentIndex = this.state.currentQuest ? this.state.currentQuest.current_waypoint_index : null;
    var numWaypoints = this.state.currentQuest ? this.state.currentQuest.waypoints.length : null;
    var message = "You do not have a current quest. Click Browse or Profile to start or resume a quest."
    return (
      <NavigatorIOS
        style={styles.wrapper}
        ref="QuestRef"
        initialRoute={{
          title: 'Current Quest',
          backButtonTitle: ' ',
          component: component,
          passProps: { quest: this.state.currentQuest, 
                       numWaypoints: numWaypoints,
                       currentIndex: currentIndex || 0,
                       url: this.props.baseUrl,
                       message: message }
        }}/>
    )
  }

  // renders the Profile view
  renderProfileView(){
    return (
      <NavigatorIOS
        style={styles.wrapper}
        ref="ProfileRef"
        initialRoute={{
          title: 'Profile',
          backButtonTitle: ' ',
          component: Profile,
          passProps: { user: this.props.user, 
                       onLogout: this.props.onLogout, 
                       ref: this.refs, 
                       url: this.props.baseUrl,
                       setCurrentQuest: this.setCurrentQuest.bind(this),
                       setSelectedTab: this.setSelectedTab.bind(this) }
        }}/>
    )
  } // end of renderProfileView()

}; // end of Main class

module.exports = Main;
