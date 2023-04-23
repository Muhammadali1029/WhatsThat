import React, { Component, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, FlatList } from 'react-native-web';


export default class SingleChatScreen extends Component 
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
            chatData: [],
            newMessage: "",
            editMessage: "",
            showModal: false, 
            messageId: "",
            selectedMessage: ""
        };
    }

    componentDidMount()
    {
        this.getData();
    }

    componentDidUpdate(prevProps, prevState) 
    {
        if (prevState.chatData.length !== this.state.chatData.length) 
        {
          this.getData();
        }
    }

    getData = async () =>
    {   
        console.log("message screen request sent to api");
        return fetch("http://localhost:3333/api/1.0.0/chat/"+ this.props.route.params.item.chat_id,
        {
            method: 'get',
            headers: 
            {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
            }
        })

        .then((response) => response.json())
        .then((responseJson) => 
        {
            console.log("Message Screen Data returned from api");
            console.log(responseJson);
            this.setState
            ({
                isLoading: false,
                chatData: responseJson
            });
            console.log(this.state.chatData)
        })
        .catch((error) =>
        {
            console.log(error);
        });
    }

    sendMessage = async () =>
    {   
        console.log("send message request sent to api")
        
        let to_send = 
        {
            message: this.state.newMessage
        };

        return fetch("http://localhost:3333/api/1.0.0/chat/"+this.props.route.params.item.chat_id+"/message", 
            {
                method: 'post',
                headers: 
                {
                    'Content-Type': 'application/json',
                    'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
                },
                body: JSON.stringify(to_send)
            })

        .then((response) => 
        {
            console.log("New Message sent to api");
            if(response.status === 200)
            {   
                console.log("message sent successfully")
                this.getData()
                return response.json();
            }
            else 
            {
                throw "Something went wrong"
            }
        })

        .catch((error) =>
        {
            console.log(error);
        });
    }

    editMessage = async () =>
    {
        console.log("edit button pressed")
        console.log(this.state.messageID)

        let to_send =
        {   
            message: this.state.editMessage
        };    
        return fetch("http://localhost:3333/api/1.0.0/chat/"+this.props.route.params.item.chat_id+"/message/"+this.state.messageId,
        {
            method: 'PATCH',
            headers: 
            {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
            },
            body: JSON.stringify(to_send)
        })
        .then((response) => 
        {
            console.log("Edit Message sent to api");
            if(response.status === 200)
            {   
                console.log("message eddited successfully")
                this.getData()
                return response.json();
            }
            else 
            {
                throw "Something went wrong"
            }
        })

        .catch((error) =>
        {
            console.log(error);
        });
    }

    deleteMessage = async () =>
    {
        console.log("Delete button pressed");
        return fetch("http://localhost:3333/api/1.0.0/chat/"+this.props.route.params.item.chat_id+"/message/"+this.state.messageId,
        {
            method: 'DELETE',
            headers: 
            {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
            }
        })

        .then((response) => 
        {
            console.log("Delete Message sent to api");
            if(response.status === 200)
            {   
                console.log("message deleted successfully")
                this.getData()
                return response.json();
            }
            else 
            {
                throw "Something went wrong"
            }
        })

        .catch((error) =>
        {
            console.log(error);
        });
    }

    render()
    {
        return (
            <View style={styles.chat}>
                <Text style={styles.headers}>{this.state.chatData.name}</Text>

                <View>
                    <View>
                        <FlatList
                            data={this.state.chatData.messages}
                            inverted = {true}
                            renderItem = {({item}) => 
                            (   
                                <View style={styles.chats}>
                                    <TouchableOpacity onLongPress={async () => 
                                    {   
                                        console.log(item.message_id, "User ID: " + await AsyncStorage.getItem('whatsthat_user_id'), "Message Creator ID: " + item.author.user_id), 
                                        this.setState
                                        ({
                                            messageId: item.message_id,
                                            selectedMessage: item.message
                                        })
                                        if (item.author.user_id == await AsyncStorage.getItem('whatsthat_user_id'))
                                        {
                                            this.setState({showModal:true})
                                        }
                                    }}>
                                        <Text>{item.author.first_name} {item.author.last_name}: {item.message}</Text>
                                    </TouchableOpacity>
                                    <Modal
                                        transparent = {true}
                                        visible = {this.state.showModal}
                                    >   
                                        <View style={styles.modalBackground}>
                                            <View style={styles.modal}>   
                                                <View>
                                                    <TextInput 
                                                        style={styles.messageBox}
                                                        placeholder= {this.state.selectedMessage}
                                                        onChangeText={editMessage => this.setState({editMessage})}
                                                    />
                                                    
                                                    <Button
                                                        title = "Confirm Edit"
                                                        onPress = {() => 
                                                        {
                                                            this.editMessage(), 
                                                            console.log("Edited Message ID: " + this.state.messageId),
                                                            this.setState({showModal:false})
                                                        }}
                                                    />
                                                </View>
                                                
                                                <Button
                                                    title = "Delete"
                                                    onPress = {() => 
                                                    {
                                                        this.deleteMessage(),
                                                        console.log("Deleted Message ID: " + this.state.messageId),
                                                        this.setState({showModal:false})
                                                    }}
                                                />

                                                <Button
                                                    title = "Cancel"
                                                    onPress = {() => this.setState({showModal:false})}
                                                />
                                            </View>
                                        </View>
                                    </Modal>
                                </View>
                            )}
                            keyExtractor={({message_id}, index) => message_id}
                        />
                    </View>

                    <View style={styles.sendMessageContainer}>
                        <TextInput 
                            style={styles.messageBox}
                            placeholder="Enter Message"
                            onChangeText={newMessage => this.setState({newMessage})}
                            defaultValue={this.state.newMessage}
                        />
                        <Button
                            style={styles.button}
                            title = "Send"
                            onPress={() => 
                            {
                                if(this.state.newMessage != "")
                                {
                                    this.sendMessage(this.state.newMessage)
                                }}
                            }
                        />
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create
({
    headers:
    {
        fontSize: 20,
        marginBottom: 20,
        borderWidth: 2
    },
    chat:
    {
        flex: 1, 
        justifyContent: 'space-between'
    },
    chats:
    {
    
    },
    messageBox:
    {
        height: 40, 
        borderWidth: 1, 
        width: "60%",
        marginTop: 10
    },
    sendMessageContainer:
    {
        flewDirection: 'row'
    },
    button:
    {
        width: '20%'
    },
    modalBackground:
    {
        backgroundColor: "",
        flex: 1
    },
    modal:
    {
        backgroundColor: "#ffffff",
        margin: 50,
        padding: 40, 
        borderRadius: 10,
        flex: 1,
        height: 50,
        width: '70%'
    }
});