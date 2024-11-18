"use client";

import axios from "axios";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { capitalize } from "~/lib/utils";
import { SinglePokemon } from "~/types";

export let TOP_URL = `https://pokeapi.co/api/v2`;

type PokemonMassRequest = {
  name: string;
  url: string;
};

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<PokemonMassRequest[] | null[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  function fetchApi() {
    axios
      .get(`${TOP_URL}/pokemon?limit=1250&offset=${offset}`)
      .then((r) => {
        if (r.status !== 200) {
          setFailed(true);
        } else {
          setData(r.data.results);
          setOffset(offset + 100);
        }
        return;
      })
      .then(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });
  }
  useEffect(() => {
    fetchApi();
  }, []);
  return (
    <div className="mx-auto mt-[10rem] flex flex-col items-center justify-center">
      <div className="mb-[4rem] flex flex-col gap-4 text-center">
        {failed ? (
          <p className="text-sm text-red-500">
            Seems like a problem has occured :(
          </p>
        ) : (
          <p className="text-sm opacity-15">i cba to make a pagination!</p>
        )}
        <input
          type="text"
          className="smooth_transition bg-blue-500/05 rounded-lg border border-green-500/50 p-3 outline-none focus:border-green-500/100"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
      {loading ? (
        <div className="flex">
          <Loader className="animate-spin" size={18} />
        </div>
      ) : (
        <div className="flex max-w-[750px] flex-wrap items-center justify-center gap-3">
          {data
            .sort((a, b) => {
              if ((a?.name as string) < (b?.name as string)) {
                return -1;
              }
              if ((a?.name as string) > (b?.name as string)) {
                return 1;
              }
              return 0;
            })
            .filter((f) => f?.name.toLowerCase().includes(search.toLowerCase()))
            .map((d) => {
              const name = d?.name.split("-") as string[];
              if (name.length > 1) {
                return (
                  <div
                    key={d?.name.split(" ").join("-").toLowerCase()}
                    onClick={() => {
                      window.location.href = `/${d?.name.toLowerCase()}`;
                    }}
                    className="smooth_transition w-[150px] scale-[1] cursor-pointer rounded-lg bg-gray-400/20 p-3 hover:scale-[0.96] active:scale-[1.03]"
                  >
                    <span>{capitalize(name[0] as string)}</span>
                  </div>
                );
              } else {
                return null;
              }
            })}
          {data.filter((f) =>
            f?.name.toLowerCase().includes(search.toLowerCase()),
          ).length <= 0 ? (
            <p className="opacity-50">
              No search results found! (why so feinous)
            </p>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}
