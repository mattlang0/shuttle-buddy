import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { StepType } from '../logic/Types';
import { Step } from '../components/Step';

type SwipableTabsProps = {
    steps: StepType[],
    index: number,
    setIndex: React.Dispatch<React.SetStateAction<number>>,
}

const createSceneMapFromSteps = (steps: StepType[]) => {
    const raw = steps.map((step: StepType, index: number)=>{
                    const key = index.toString();
                    const value = () => <Step step={step} />

                    return {
                        [key]: value
                    }
                })
    const clean = Object.assign({}, ...raw);

    return SceneMap(clean);
};

const createRouteStateFromSteps = (steps: StepType[]) => {
    const raw = steps.map((step: StepType, index: number)=>{
        const key = index.toString();
        return {
            key: key
        }
    })
    return raw;
};

export default function SwipableTabs(props: SwipableTabsProps) {
    const {index, setIndex, steps} = props;
    const layout = useWindowDimensions();

    const [routes] = React.useState(createRouteStateFromSteps(steps));

    return (
        <TabView
            renderTabBar={() => null}
            navigationState={{ index, routes }}
            renderScene={createSceneMapFromSteps(steps)}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
    );
}