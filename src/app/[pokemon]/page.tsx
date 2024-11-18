"use client";

import axios from "axios";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { SinglePokemon } from "~/types";
import { TOP_URL } from "../page";
import { capitalize } from "~/lib/utils";

type PokemonPageParams = {
  params: { pokemon: string };
};

export default function PokemonPage({ params }: PokemonPageParams) {
  const [data, setData] = useState<SinglePokemon | null>();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    (async () => {
      axios.get(`${TOP_URL}/pokemon/${(await params).pokemon}`).then((r) => {
        if (r.status !== 200) {
          setFailed(true);
        } else {
          setData(r.data as SinglePokemon);
          setTimeout(() => {
            setLoading(false);
          }, 1500);
        }
      });
    })();
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="h-[500px] w-[700px]">
        {failed ? (
          <div className="flex items-center justify-center text-center">
            <p className="text-sm text-red-500">Failed to fetch pokemon.</p>
          </div>
        ) : (
          <></>
        )}
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader className="animate-spin" size={18} />
          </div>
        ) : (
          <div className="flex rounded-lg p-3">
            <div className="flex flex-col gap-1">
              <img
                src={data?.sprites.front_default}
                className="rounded-lg border border-green-200/70 bg-green-800"
                alt={`${data?.name}'s picture`}
              />
              <a
                href="/"
                className="smooth_transition mt-[1rem] scale-[1] rounded-lg border border-green-200/70 bg-green-800 px-4 py-1 text-white hover:scale-[0.96] active:scale-[1.03]"
              >
                Go Home!
              </a>
            </div>
            <div className="flex max-h-[600px] w-[500px] flex-col items-start gap-3 overflow-y-scroll p-3">
              <h1 className="text-lg font-bold">
                {capitalize(data?.name.split("-").join(" ") as string)}
              </h1>
              <div className="mt-[0.5rem]">
                <p className="mb-[0.5rem] text-sm opacity-30">Statistics</p>
                <div className="flex flex-wrap gap-2">
                  {data?.stats.map((z, i) => {
                    return (
                      <div
                        key={z.stat.name.split(" ").join("-").toLowerCase()}
                        className="mb-[1rem] flex max-w-[500px] flex-wrap"
                      >
                        <div className="flex h-[125px] w-[225px] flex-col items-center justify-center gap-3 rounded-lg border border-green-200/70 bg-green-700/30 p-3 shadow-sm">
                          <h1 className="text-3xl font-bold">{z.base_stat}</h1>
                          <p className="text-sm opacity-55">
                            {capitalize(z.stat.name.split("-").join(" "))}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-[0.5rem]">
                <p className="mb-[0.5rem] text-sm opacity-30">Abilites</p>
                <div className="flex flex-wrap gap-2">
                  {data?.abilities.map((z, i) => {
                    return (
                      <div
                        key={z.ability.name.split(" ").join("-").toLowerCase()}
                        className="mb-[1rem] flex max-w-[500px] flex-wrap"
                      >
                        <div className="flex h-[125px] w-[225px] flex-col items-center justify-center gap-3 rounded-lg border border-green-200/70 bg-green-700/30 p-3 shadow-sm">
                          <h1 className="text-3xl font-bold">
                            {capitalize(z.ability.name.split("-").join(" "))}
                          </h1>
                          <a
                            className="text-sm text-blue-800 hover:text-blue-600"
                            href={z.ability.url}
                          >
                            View more (raw api)
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
