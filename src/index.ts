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
  description: "Bot will say hello to you!",
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

const slashCommandHandler = createSlashCommandHandler({
  applicationID: applicationID,
  applicationSecret: applicationSecret,
  publicKey: publicKey,
  commands: [[helloCommand, helloHandler]],
});

addEventListener("fetch", (event) => {
  event.respondWith(slashCommandHandler(event.request));
});