const NUM_COLORS = 20;

export const colors = Array.from({ length: NUM_COLORS }, (_, i) => {
    const hue = Math.floor((360 / NUM_COLORS) * i);
    return `hsl(${hue}, 70%, 50%)`;
});

