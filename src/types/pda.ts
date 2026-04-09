export type Severity = 'error' | 'warning' | 'info';

export type PDAMessage = {
    id: string;
    say: string;
    title: string;
    groupid: number;
    statusid: number;
    subtitle: string;
    visgroup: string;
    locationid: number;
    description: string;
    saylocation: string;
    vislocation: string;
    systempartid: number;
    severity: Severity;
    timestamp: number;
    read: boolean;
};
