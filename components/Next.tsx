import { getNextPublishedProject } from "@/action/server";
import { Project } from "@/type/editor";
import Link from "next/link";
import React from "react";
import Bottom from "./Bottom";

const Next = async ({ created_at }: { created_at: string }) =>
    <>
        <section className='text-center font-serif slide-from-bottom anim-delay-[100ms] text-sm/loose sm:text-base/loose md:text-lg/loose font-medium max-w-2xs sm:max-w-md md:max-w-xl lg:max-w-2xl'>
            <p>Let’s talk about your project. <Link className='underline' href='/contact'>Contact</Link> us to discuss the possibilities for your space.</p>
        </section>
        <section className='text-center flex flex-col justify-center items-center gap-y-10 max-w-md lg:max-w-lg'>
            {
                getNextPublishedProject(1, created_at).then(
                    v => v.map((v: Project) =>
                        <React.Fragment key={ v.id }>
                            <small className='uppercase font-sans text-base font-semibold text-gold-950'>Next</small>
                            <h5 className='text-2xl/loose font-serif lg:text-4xl/loose'>{ v.name }</h5>
                            <Link className='text-lg font-semibold font-sans text-amber-600' href={ `/projects/${v.slug}` }>See project &rarr;</Link>
                        </React.Fragment>
                    ),
                    () => ([])
                )
            }
        </section>
        <Bottom />
    </>

export default Next