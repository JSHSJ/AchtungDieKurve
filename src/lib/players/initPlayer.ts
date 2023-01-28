import { Player } from '../../modules/Player/Player';

export const initPlayer: (
    initColor: Player['color'],
    initControls: Player['controls'],
) => Player = (initColor, initControls) => {
    const player = Player.createPlayerStub();
    if (initColor) player.color = initColor;
    if (initControls) player.controls = initControls;
    return player;
};
