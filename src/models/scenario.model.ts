
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
    const newScenario = [] as ScenarioInternal;
    scenario.forEach((snapshot) => {
        const newSnapshot = [...snapshot] as SnapshotInternal;
        newSnapshot.push({x, y});
        newScenario.push(newSnapshot);
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
            const snapshot = [...newScenario[start + i]];
            snapshot[id] = {x, y};
            newScenario[start + i] = snapshot;
        } else {
            const lastSnapshot = [...newScenario[newScenario.length - 1]];            
            lastSnapshot[id] = {x, y}
            newScenario.push(lastSnapshot);
        }
    }
    for (let i = end; i < newScenario.length; i++) {
        const snapshot = [...newScenario[i]]
        snapshot[id] = {x: goalX,y: goalY};
        newScenario[i] = snapshot;
    }
    return newScenario;
}

export const removeMobile = (id: number, scenario: Scenario): Scenario => {
    const newScenario = [] as ScenarioInternal;
    scenario.forEach((snapshot) => {
        const newSnapshot = [...snapshot] as SnapshotInternal;
        newSnapshot.splice(id, 1)
        newScenario.push(newSnapshot);
    });
    return newScenario;
}