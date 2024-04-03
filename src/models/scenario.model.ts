
type MobileInternal = {
    x: number;
    y: number;
}
export type Mobile = {
    readonly x: number;
    readonly y: number;
};

type SnapshotInternal = MobileInternal[];
export type Snapshot = readonly Mobile[];

type ScenarioInternal = SnapshotInternal[];
export type Scenario = readonly Snapshot[];

export const INITIAL_SCENARIO: Scenario = [[]];

export const addMobile = (x: number, y: number, scenario: Scenario): Scenario => {
    const newScenario = [...scenario] as ScenarioInternal;
    newScenario.forEach((snapshot) => {
        snapshot.push({x, y});
    });
    return newScenario;
}

export const moveMobile = (goalX: number, goalY: number, id: number, start: number, end: number, scenario: Scenario): Scenario => {
    const newScenario = [...scenario] as ScenarioInternal;
    const startPoint = scenario[start][id];
    const startX = startPoint.x;
    const startY = startPoint.y;
    const diff = end - start;
    for (let i = 0; i <= diff; i++) {
        const x = startX + (goalX - startX) * i / diff;
        const y = startY + (goalY - startY) * i / diff;
        if ((start + i) < newScenario.length) {
            newScenario[start + i][id].x = x;
            newScenario[start + i][id].y = y;
        } else {
            const lastSnapshot = [...newScenario[newScenario.length - 1]];            
            lastSnapshot[id] = {x, y}
            newScenario.push(lastSnapshot);
        }
    }
    return newScenario;
}