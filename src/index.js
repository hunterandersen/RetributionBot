require("dotenv").config();
const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILDS]
});

let guildsData = {};
let voiceMembers = {};

let voiceStates = {};

//List of all the servers the bot is in
//List of all the channels in each server
//List of all users currently in each channel

/*
* let hugeData[guildId] = {
    channelId:[user1, user2, user3...]
    channelId2:[user1, user2, user3]
}
*/

client.once('ready', (client) => {

    //Sets up the list of current guilds and the current voice channels within each one, AND the current members in each channel
    client.guilds.cache.forEach(guild => {
        voiceStates[guild.id] = guild.members.cache.map((member) => {
            if (member.voice){
                console.log(`Voice channel ${member.voice.channelId}`);
                return member.voice;
            }
        });

        //console.log(`Guild: ${guild.id}`);
        guildsData[guild.id] = client.channels.cache.map((channel) => {
            if(channel.type === 'GUILD_VOICE' && channel.guildId === guild.id){
                if(channel.members){
                    voiceMembers[channel.id] = Array.from(channel.members.filter((thing) =>{
                        return !thing.id.includes('@');
                    })); //Adds the current voice members to the array
                    //console.log(`32:  ${voiceMembers[channel.id]}`);
                }
                return channel;
            }
        }).filter((value)=>{
            return value;
        });
    });
    /* console.log(`UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU`);
    console.log(guildsData);

    console.log(`-----------------------------------------------------------------`);
    console.log(`${voiceMembers}`);
    console.log(`${Object.keys(voiceMembers)}`);
    console.log(`${Object.values(voiceMembers)}`); */

    

});

client.on('interaction', (interaction)=>{
    console.log(`Interaction! ${interaction}`);
});

client.on('messageCreate', (message)=> {
    console.log(`The message: ${message}`);
});

//I have the intent for this one
//The states are of type VoiceState (ref: https://discord.js.org/#/docs/discord.js/stable/class/VoiceState)
client.on('voiceStateUpdate', (oldState, newState) => {

    if (voiceStates[newState.guild.id]){
        let userIndex = voiceStates[newState.guild.id].indexOf(newState.member.voice);
        console.log(`UserIndex: ${userIndex} |||| voice: ${voiceStates[newState.guild.id][userIndex].channelId}`);
        voiceStates[newState.guild.id][userIndex] = newState.member.voice;
        console.log(`New Voice Channel: ${voiceStates[newState.guild.id][userIndex].channelId}`);

    }
    


    //console.log(`62:  ${voiceMembers[oldState.channelId]}`);
    /*
    * 1. Track the user to the channel
    * 2. If the channel gets deleted with users in it, then fix it.
    * 3. Move the users back into the fixed channel.
    * 
    */
   let oldChannelId = oldState.channelId;
   let newChannelId = newState.channelId;
   //Track the member's move to the new channel
   /* if (!voiceMembers[newChannelId]){
       voiceMembers[newChannelId] = [newState.id];
   }else{
       voiceMembers[newChannelId].push(newState.id);
   } */

   //Remove the member tracking in the previous channel
   /* let oldIndex;
   if (oldIndex = voiceMembers[oldChannelId]?.indexOf(oldState.id)){
       console.log(`Splicing!  ${voiceMembers[oldChannelId]}`);
       voiceMembers[oldChannelId].splice(oldIndex, 1);
       console.log(`${voiceMembers[oldChannelId]}`);
   }

   console.log(`${voiceMembers[newChannelId]}`);
   console.log(Object.values(voiceMembers)); */


    console.log(`Voice State change from ${oldState.id} to ${newState.id}`);
    console.log(`Voice State change from ${oldState.channel.name} ${oldState.channelId} to ${newState.channel.name} ${newState.channelId}`);
});

client.on('channelDelete', channel => {
    const channelId = channel.id;
    console.log(`Channel Client: ${channel.client}`);

    //Find all channel deletions in the log
    channel.guild.fetchAuditLogs({'type': 'CHANNEL_DELETE'}) 
    //Find the log entry for this specific channel
    .then(logs => logs.entries.find(entry => entry.target.id == channelId) ) 
    .then (entry => {
        //Get the author of the deletion
        author = entry.executor;

        //Do whatever you want
        console.log(`channel ${channel.name} deleted by ${author.tag}`);
    })
    .catch(error => console.error(error));

});

client.on('userUpdate', (oldUser, newUser) => {
    console.log(`${oldUser} : ${newUser}`);
});

client.login(process.env.DISCORD_BOT_TOKEN_RETRIBUTION);