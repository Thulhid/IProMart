"use client";

import ContainerBox from "@/app/_components/ContainerBox";
import BackButton from "@/app/_components/BackButton";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import {
  GiTechnoHeart,
  GiProgression,
  GiTeamIdea,
  GiGameConsole,
} from "react-icons/gi";
import SparkEffect from "@/app/_components/SparkEffect";

export default function AboutPage() {
  return (
    <div className="mx-4 my-6 2xl:mx-auto 2xl:max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">About This App</h1>
      </div>

      <ContainerBox>
        <div className="space-y-10 rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-md shadow-blue-600/30">
          {/* Version Info */}
          <div className="flex items-end gap-5">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-zinc-100">
              <SparkEffect>
                <GiTechnoHeart size={30} className="mt-1 text-blue-500" />
              </SparkEffect>
              App Version
            </h2>
            <p className="text-zinc-400">v1.2.0</p>
          </div>

          {/* What's New */}
          <div className="flex items-start gap-4">
            <GiProgression size={30} className="mt-1 text-blue-400" />
            <div>
              <h2 className="mb-2 flex items-center gap-2 text-4xl font-semibold text-zinc-100">
                What’s New
              </h2>
              <ul className="ml-4 list-disc space-y-2 text-sm text-zinc-400">
                <li> Modularized admin UI</li>
                <li> Integrated PayHere Sandbox securely</li>
                <li> Updated shipping fee structure</li>
                <li> Full mobile/tablet responsiveness</li>
                <li> Enhanced backend validation & auth</li>
              </ul>
            </div>
          </div>
        </div>
      </ContainerBox>
    </div>
  );
}
