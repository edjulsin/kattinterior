import { getProjects } from '@/action/server';
import Error from '@/components/Error';
import Projects from '@/components/Projects';

export default () => getProjects(8).then(
    v => <Projects projects={ v } />,
    () => <Error title='Database Error' />
)