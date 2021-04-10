import {
  createSlashCommandHandler,
  ApplicationCommand,
  InteractionHandler,
  Interaction,
  InteractionResponse,
  InteractionResponseType,
} from "@glenstack/cf-workers-discord-bot";

const helloCommand: ApplicationCommand = {
  name: "hello",
  description: "bot will say hello to you!",
};

const helloHandler: InteractionHandler = async (
  interaction: Interaction
): Promise<InteractionResponse> => {
  const userID = interaction.member.user.id;

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `Hello, <@${userID}>!`,
      allowed_mentions: {
        users: [userID],
      },
    },
  };
};

const ytCommand: ApplicationCommand = {
  name: "yt",
  description: "starts a YouTube watch together session",
  options: [
    {
      name: "channel",
      description: "the voice channel to setup in",
      type: 7,
      required: true
    }
  ]
}

const ytHandler: InteractionHandler = async (
  interaction: Interaction
): Promise<InteractionResponse> => {
  const userID = interaction.member.user.id

  const r = await fetch(`https://discord.com/api/v8/channels/${interaction.data!.options![0].value}/invites`, {
    method: 'POST',
    // @ts-expect-error (supresses error shown due to use of Cloudflare Workers Secrets)
    headers: { authorization: `Bot ${botToken}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      max_age: 86400,
      target_type: 2,
      target_application_id: "755600276941176913"
    })
  })

  const invite = await r.json()
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `[Click to open ${invite.target_application.name} in ${invite.channel!.name}](<https://discord.gg/${invite.code}>)`,
      allowed_mentions: { parse: [] }
    }
  }
}

const slashCommandHandler = createSlashCommandHandler({
  // @ts-expect-error (supresses error shown due to use of Cloudflare Workers Secrets)
  applicationID: applicationID, applicationSecret: applicationSecret, publicKey: publicKey,
  commands: [[helloCommand, helloHandler], [ytCommand, ytHandler]],
});

addEventListener("fetch", (event) => {
  event.respondWith(slashCommandHandler(event.request));
});