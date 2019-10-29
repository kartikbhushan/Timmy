const Discord=require('discord.js');
const client= new Discord.Client()
const weather=require('weather-js');
const prefix = '!';
const randomPuppy = require('random-puppy');
const ascii = require('ascii-art');

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);

    client.user.setActivity("Youtube ",{type:"WATCHING"});

    client.guilds.forEach((guild) => {
        console.log(guild.name);
        guild.channels.forEach((channel) => {
            console.log(` - ${channel.name} ${channel.type} ${channel.id} `);
        })
        //General Channel id = 638644334312554499
    })
    let generalChannel= client.channels.get("638644334312554499");
    const attachment= new Discord.Attachment("https://media.sproutsocial.com/uploads/2018/03/The-Complete-Guide-to-Chatbots-b605987a-a012-4ed4-a490-14ad11f88ac5.png")
    generalChannel.send("Hi there");
    generalChannel.send(attachment);
})

client.on('message', (receivedMessage) => {
    
    if (receivedMessage.author == client.user ){
        return;
    }
    //receivedMessage.channel.send("Message received , "+ receivedMessage.author.toString() +": "+ receivedMessage.content);
    //receivedMessage.react("😁");
    /* to loop through all the custom emoji ids 
    receivedMessage.guild.emojis.forEach(customEmoji => {
        console.log(` ${customEmoji.name} ${customEmoji.id} `);
        receivedMessage.react(customEmoji);
    })*/
    //let customEmoji = receivedMessage.guild.emojis.get("638653383363919882");
    //receivedMessage.react(customEmoji);

    if(receivedMessage.content.startsWith("!")){
        processCommand(receivedMessage)
    }
})


function processCommand(receivedMessage){
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0];
    let arguments = splitCommand.slice(1);
    let cont = receivedMessage.content.slice(prefix.length).split(" "); 
    let args = cont.slice(1); 

    if(primaryCommand == "help"){
        helpCommand(arguments,receivedMessage)
    }else if (primaryCommand == "multiply"){
        multiplyCommand(arguments,receivedMessage);
    }else if (primaryCommand == "weather"){
        weatherCommand(arguments,receivedMessage);
    }else if (primaryCommand == "add"){
        addCommand(arguments,receivedMessage);
    }else if (primaryCommand == "sub"){
        subCommand(arguments,receivedMessage);
    }else if (primaryCommand == "meme"){
        memeCommand(arguments,receivedMessage);
    }else if (primaryCommand == "foodporn"){
        foodCommand(arguments,receivedMessage);
    }else if (primaryCommand == "ascii"){
        asciiCommand(arguments,receivedMessage);
    }else {
        receivedMessage.channel.send("Unkown command. Try `!help ` or `!multiply  or !add or !sub `");
    }
}

function helpCommand(arguments,receivedMessage){
    if(arguments.length == 0){
        receivedMessage.channel.send("I am noy sure what you need help with .Try `!help [topic]`");
    }
    else{
        receivedMessage.channel.send("Looks like you need help with " + arguments);
    }
}

function multiplyCommand(arguments,receivedMessage){
    if(arguments.length < 2){
        receivedMessage.channel.send("Not Enough Argumnets.Try `!multiply 2 10 `");
        return
    }
    let product=1;
    arguments.forEach((value) => {
        product = product * parseFloat(value)
    })
    receivedMessage.channel.send("The product of " + arguments +" is " + product.toString());
}


function addCommand(arguments,receivedMessage){
    if(arguments.length < 2){
        receivedMessage.channel.send("Not Enough Argumnets.Try `!add 2 10 `");
        return
    }
    let sum=0;
    arguments.forEach((value) => {
        sum = sum + parseFloat(value)
    })
    receivedMessage.channel.send("The sum of " + arguments +" is " + sum.toString());
}


function subCommand(arguments,receivedMessage){
    if(arguments.length < 2){
        receivedMessage.channel.send("Not Enough Argumnets.Try `!sub 2 10 `");
        return
    }
    let sub=0;
    arguments.forEach((value) => {
        sub =  - sub  - parseFloat(value)
    })
    receivedMessage.channel.send("The subtraction of " + arguments +" is " + sub.toString());
}

function memeCommand(arguments,receivedMessage){
    let reddit = [
        "meme",
        "animemes",
        "MemesOfAnime",
        "animememes",
        "AnimeFunny",
        "dankmemes",
        "dankmeme",
        "wholesomememes",
        "MemeEconomy",
        "techsupportanimals",
        "meirl",
        "me_irl",
        "2meirl4meirl",
        "AdviceAnimals"
    ]

    let subreddit = reddit[Math.floor(Math.random() * reddit.length)];

    receivedMessage.channel.startTyping();

    randomPuppy(subreddit).then(async url => {
            await receivedMessage.channel.send({
                files: [{
                    attachment: url,
                    name: 'meme.png'
                }]
            }).then(() => receivedMessage.channel.stopTyping());
    }).catch(err => console.error(err));
}


function foodCommand(arguments,receivedMessage){
    let reddit = [
        "food",
        "FoodPorn",
        "IndianFood"
    ]

    let subreddit = reddit[Math.floor(Math.random() * reddit.length)];

    receivedMessage.channel.startTyping();

    randomPuppy(subreddit).then(async url => {
            await receivedMessage.channel.send({
                files: [{
                    attachment: url,
                    name: 'meme.png'
                }]
            }).then(() => receivedMessage.channel.stopTyping());
    }).catch(err => console.error(err));
}

function asciiCommand(arguments,receivedMessage){
    if (!arguments.join(' ')) return receivedMessage.reply('please specify texts for the ascii conversion');

    ascii.font(arguments.join(' '), 'Doom', async txt => {
        receivedMessage.channel.send(txt, {
            code: 'md'
        });
    });

}

function weatherCommand(arguments,receivedMessage){
    weather.find({search:arguments.join(" "), degreeType: 'F'}, function(err, result) {
        if (err){
             receivedMessage.channel.send(err);
        }
        // We also want them to know if a place they enter is invalid.
        if (result === undefined || result.length === 0) {
            receivedMessage.channel.send('**Please enter a valid location.**') // This tells them in chat that the place they entered is invalid.
            return; // This exits the code so the rest doesn't run.
        }

        // Variables
        var current = result[0].current; // This is a variable for the current part of the JSON output
        var location = result[0].location; // This is a variable for the location part of the JSON output

        // Let's use an embed for this.
        const embed = new Discord.RichEmbed()
            .setDescription(`**${current.skytext}**`) // This is the text of what the sky looks like, remember you can find all of this on the weather-js npm page.
            .setAuthor(`Weather for ${current.observationpoint}`) // This shows the current location of the weather.
            .setThumbnail(current.imageUrl) // This sets the thumbnail of the embed
            .setColor(0x00AE86) // This sets the color of the embed, you can set this to anything if you look put a hex color picker, just make sure you put 0x infront of the hex
            .addField('Timezone',`UTC${location.timezone}`, true) // This is the first field, it shows the timezone, and the true means `inline`, you can read more about this on the official discord.js documentation
            .addField('Degree Type',location.degreetype, true)// This is the field that shows the degree type, and is inline
            .addField('Temperature',`${current.temperature} Degrees`, true)
            .addField('Feels Like', `${current.feelslike} Degrees`, true)
            .addField('Winds',current.winddisplay, true)
            .addField('Humidity', `${current.humidity}%`, true)

            // Now, let's display it when called
            receivedMessage.channel.send({embed});
    });
}

client.login("NjM4NjQ0NzQ2Nzg0MzQyMDE3.XbfvSA.JAa78MTJ1aaDR4anhGtdafOoFp0");
