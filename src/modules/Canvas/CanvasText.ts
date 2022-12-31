export const fontBig = '3rem system-ui';
export const fontSmall = '1.5rem system-ui';

export const fontHeightBig = 48;
export const fontHeightSmall = 24;
export const fontGap = 12;

export enum TextBlockSize {
    Small = 'Small',
    Big = 'Big',
}

export type TTextBlock = {
    text: string;
    size: TextBlockSize;
    color: string;
};

export const getTextBlockHeight = (textBlock: TTextBlock) => {
    switch (textBlock.size) {
        case TextBlockSize.Big:
            return fontHeightBig;
        case TextBlockSize.Small:
            return fontHeightSmall;
    }
};

export const getTextBlockGap = (textBlock: TTextBlock) => {
    switch (textBlock.size) {
        case TextBlockSize.Big:
            return fontGap;
        case TextBlockSize.Small:
            return fontGap;
    }
};

export const getTextBlockFont = (textBlock: TTextBlock) => {
    switch (textBlock.size) {
        case TextBlockSize.Big:
            return fontBig;
        case TextBlockSize.Small:
            return fontSmall;
    }
};

export const drawText = (
    ctx: CanvasRenderingContext2D,
    textBlocks: TTextBlock[],
    centerX: number,
    centerY: number,
) => {
    const totalHeight = textBlocks.reduce(
        (acc, block, idx) =>
            acc +
            getTextBlockHeight(block) +
            (idx === textBlocks.length - 1 ? 0 : getTextBlockGap(block)),
        0,
    );
    let currentY = centerY - totalHeight / 2;

    textBlocks.forEach((block) => {
        ctx.font = getTextBlockFont(block);
        ctx.textAlign = 'center';
        ctx.fillStyle = block.color;
        ctx.fillText(block.text, centerX, currentY + getTextBlockHeight(block));
        currentY += getTextBlockHeight(block) + getTextBlockGap(block);
    });
};

export const getUIColor = () => {
    const helperEl = document.querySelector('.canvas-color-helper');
    if (!helperEl) {
        return 'red';
    }
    return window.getComputedStyle(helperEl).color;
};
