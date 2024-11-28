import { TimeDto } from "./TimeDto";

export interface IEventDto {
    id: number,
    title: string,
    date: Date,
    startTime: TimeDto,
    endTime: TimeDto
}
