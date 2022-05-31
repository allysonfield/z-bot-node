module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState) {
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;
    const HUB_CHANNEL_ID = process.env.GUILD_ID;
    const HUB_CATEGORY_ID = await oldChannel
      ?.fetch(HUB_CHANNEL_ID)
      .then((chanel) => chanel.parentId);
    const channels = newChannel?.parent.children;
    let num = channels?.size;

    // if (typeof HUB_CHANNEL_ID !== "number") return;

    if (
      HUB_CHANNEL_ID &&
      oldChannel?.id !== HUB_CHANNEL_ID &&
      oldChannel?.parent.id === HUB_CATEGORY_ID &&
      oldChannel?.members.size === 0
    ) {
      oldChannel.delete();
      num = oldChannel.name.split(" ")[1];
    }

    if (newChannel?.id === HUB_CHANNEL_ID) {
      for (let i = 1; i < num; i++) {
        let isFound = false;
        for (const channel of channels.values()) {
          if (channel.name.indexOf("CND") === -1) continue;
          if (i == channel.name.split(" ")[1]) {
            isFound = true;
            break;
          }
        }
        if (!isFound) {
          num = i;
          break;
        }
        isFound = false;
      }

      const name = newState.member.displayName;
      newChannel.parent
        .createChannel(`CND ${num} - ${name}`, {
          type: "GUILD_VOICE",
          userLimit: 5,
          position: num - 1
          // permissionOverwrites: [{
          //   id: newState.member.id,
          //   allow: ['MANAGE_CHANNELS', 'MOVE_MEMBERS'],
          // }],
        })
        .then((channel) => {
          try {
            channel.permissionOverwrites.edit(newState.member.id, {
              MANAGE_CHANNELS: true,
              MOVE_MEMBERS: true
            });
            newState.setChannel(channel);
          } catch (err) {
            console.error(err);
          }
        });
    }
  }
};
