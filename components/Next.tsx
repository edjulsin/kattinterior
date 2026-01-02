import { getNextPublishedProject } from "@/action/anon";
import { Project } from "@/type/editor";
import Link from "next/link";
import React from "react";
import Bottom from "./Bottom";

const defaultVisit = {
    title: 'Gallery',
    destination: '/projects',
    copy: 'See all projects'
}

const Next = async ({ created_at }: { created_at: string }) =>
    <>
        <section className='text-center font-serif slide-from-bottom anim-delay-[100ms] text-sm/loose sm:text-base/loose md:text-lg/loose font-medium max-w-2xs sm:max-w-md md:max-w-xl lg:max-w-2xl'>
            <h4>Let’s talk about your project. <Link className='underline' href='/contact'>Contact</Link> us to discuss the possibilities for your space.</h4>
        </section>
        <section className='text-center flex flex-col justify-center items-center gap-y-5 max-w-md xl:max-w-lg'>
            {
                getNextPublishedProject(1, created_at).then(
                    v => v.map((v: Project) => {
                        return {
                            title: v.name,
                            destination: `/projects/${v.slug}`,
                            copy: 'See project'
                        }
                    }).concat([defaultVisit]).slice(0, 1).map(({ title, destination, copy }) =>
                        <React.Fragment key={title + destination + copy}>
                            <small className='uppercase font-sans text-base font-semibold text-gold-950'>Next</small>
                            <h5 className='font-serif text-2xl/loose lg:text-4xl/loose capitalize'>{title}</h5>
                            <Link className='text-lg font-semibold font-sans text-amber-600' href={destination}>{copy} &rarr;</Link>
                        </React.Fragment>
                    ),
                    () => ([])
                )
            }
        </section>
        <Bottom />
    </>

export default Next