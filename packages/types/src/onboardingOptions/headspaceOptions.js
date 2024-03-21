import { z } from "zod";
export const HeadspaceOptionSchema = z.object({
    value: z.number(),
    label: z.string(),
});
export const HeadspaceOptions = z.array(HeadspaceOptionSchema).parse([
    { value: 8, label: "HUNGRY" },
    { value: 1, label: "EUPHORIC" },
    { value: 9, label: "GIGGLY" },
    { value: 2, label: "ENERGETIC" },
    { value: 10, label: "HAPPY" },
    { value: 11, label: "CREATIVE" },
    { value: 12, label: "AROUSED" },
    { value: 3, label: "FOCUSED" },
    { value: 4, label: "BALANCED" },
    { value: 5, label: "CALM" },
    { value: 6, label: "RELAXED" },
    { value: 7, label: "SLEEPY" },
]);
export const HeadspaceMorningOptions = z.array(HeadspaceOptionSchema).parse([
    { value: 8, label: "HUNGRY" },
    { value: 1, label: "EUPHORIC" },
    { value: 9, label: "GIGGLY" },
    { value: 2, label: "ENERGETIC" },
    { value: 10, label: "HAPPY" },
    { value: 11, label: "CREATIVE" },
    { value: 12, label: "AROUSED" },
]);
export const HeadspaceDayOptions = z.array(HeadspaceOptionSchema).parse([
    { value: 3, label: "FOCUSED" },
    { value: 4, label: "BALANCED" },
]);
export const HeadspaceNightOptions = z.array(HeadspaceOptionSchema).parse([
    { value: 5, label: "CALM" },
    { value: 6, label: "RELAXED" },
    { value: 7, label: "SLEEPY" },
]);
