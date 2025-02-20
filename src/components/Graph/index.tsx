import React, { useState } from "react";
import { View, Text } from "react-native";
import { Svg, Path, G, Text as SvgText } from "react-native-svg";
import * as d3 from "d3";

type Props = {
    datasets: { data: number[]; color: string }[]; // Suporte para múltiplas linhas
    title: string;
};

const CHART_ASPECT_RATIO = 9 / 16;

export function Graph({ datasets, title }: Props) {
    const [width, setWidth] = useState(0);
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

    const height = width * CHART_ASPECT_RATIO;
    const chartHeight = (height * 3) / 4;

    const allValues = datasets.flatMap((dataset) => dataset.data);
    const min = Math.min(...allValues, 0);
    const max = Math.max(...allValues, 10);

    const yScale = d3.scaleLinear().domain([min, max]).range([chartHeight, 0]);
    const xScale = d3.scaleLinear().domain([0, days.length - 1]).range([0, width - 55]);

    const yTicks = d3.range(min, max + 1, Math.ceil(max / 5));

    return (
        <View onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)}>
            <Text style={{ color: "#6495ED", marginBottom: 8, fontSize: 16 }}>
                {title}
            </Text>

            <Svg width={width} height={height} viewBox={`-30 -20 ${width} ${height}`} style={{ overflow: "visible" }}>
                {/* Eixo Y - Números laterais */}
                {yTicks.map((tick) => (
                    <SvgText
                        key={tick}
                        x={-10} // Posicionar um pouco à esquerda
                        y={yScale(tick)}
                        fontSize={12}
                        fill="#6495ED"
                        textAnchor="end"
                    >
                        {tick}
                    </SvgText>
                ))}

                {/* Eixo Y - Linha vertical */}
                <Path d={`M 0 0 V ${chartHeight}`} stroke="#6495ED" strokeWidth={2} />

                {/* Desenhar Linhas */}
                {datasets.map(({ data, color }, index) => {
                    const lineFn = d3.line<number>()
                        .x((_, i) => xScale(i))
                        .y((d) => yScale(d));

                    const pathData = lineFn(data) ?? "";

                    return <Path key={index} d={pathData} stroke={color} fill="none" strokeWidth={2} />;
                })}

                {/* Eixo X - Linha horizontal */}
                <Path d={`M 0 ${chartHeight} H ${width}`} stroke="#6495ED" strokeWidth={2} />

                {/* Legenda do Eixo X */}
                {days.map((day, i) => (
                    <SvgText
                        key={i}
                        x={xScale(i)}
                        y={chartHeight + 20}
                        fontSize={14}
                        fill="#6495ED"
                        textAnchor="middle"
                    >
                        {day}
                    </SvgText>
                ))}
            </Svg>
        </View>
    );
}
