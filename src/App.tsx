import React, { useState, useEffect, useRef, MutableRefObject } from "react";
/** Components */
import { Button, Input, Card } from "./components";
import Skeleton from "react-loading-skeleton";
/** CSS */
import "react-loading-skeleton/dist/skeleton.css";

const App: React.FC = () => {
  const searchValue: MutableRefObject<string> = useRef("");

  const [searchResult, setSearchResult] = useState<Record<string, any>[]>([]);

  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);

  const fillSearchValue = (value: string) => {
    searchValue.current = value;
  };

  const fetchSearchUser = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    setSearchResult([]);

    setIsLoadingSearch(true);

    const res = await fetch(
      `${process.env.REACT_APP_GITHUB_URL}/search/users?q=${searchValue.current}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.REACT_APP_GITHUB_KEY}`,
        },
      }
    );

    const data = await res.json();

    const { items }: { items: Record<string, any>[] } = data;

    const newItems = items.map((item: Record<string, any>) => {
      return {
        ...item,
        isOpen: false,
        listRepo: [],
      };
    });

    setIsLoadingSearch(false);

    setSearchResult(newItems);
  };

  const fetchUserRepo = async (
    username: string
  ): Promise<Record<string, any>[]> => {
    const res = await fetch(
      `${process.env.REACT_APP_GITHUB_URL}/users/${username}/repos`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.REACT_APP_GITHUB_KEY}`,
        },
      }
    );

    const data = await res.json();

    return data;
  };

  const handleArrowClick = async (id: number): Promise<void> => {
    let newResult: Record<string, any>[] = [];

    const filterSearchResult: Record<string, any> = searchResult.filter(
      (result: Record<string, any>) => {
        return result.id === id;
      }
    )[0];

    if (filterSearchResult.isOpen) {
      newResult = searchResult.map((result: Record<string, any>) => {
        if (id === result.id) {
          return {
            ...result,
            isOpen: false,
          };
        }
        return {
          ...result,
        };
      });
    } else if (
      !filterSearchResult.isOpen &&
      filterSearchResult.listRepo.length
    ) {
      newResult = searchResult.map((result: Record<string, any>) => {
        if (id === result.id) {
          return {
            ...result,
            isOpen: true,
          };
        }
        return {
          ...result,
        };
      });
    } else {
      const repos: Record<string, any>[] = await fetchUserRepo(
        filterSearchResult.login
      );

      newResult = searchResult.map((result: Record<string, any>) => {
        if (id === result.id) {
          return {
            ...result,
            isOpen: true,
            listRepo: repos,
          };
        }
        return result;
      });
    }

    setSearchResult(newResult);
  };

  return (
    <div
      className="w-screen h-screen bg-teal-400/[0.4] p-3 overflow-y-auto"
      onSubmit={fetchSearchUser}
    >
      <form className="w-full">
        <div className="w-full mb-4">
          <Input
            type="text"
            placeholder="Enter Username"
            style="w-full rounded shadow-md p-3 text-sm text-gray-500"
            event={fillSearchValue}
          />
        </div>
        <Button
          type="submit"
          name="Search"
          style="w-full bg-cyan-400 shadow rounded p-2 text-white"
        />
      </form>

      <div className="mt-4 w-full">
        {searchValue.current.length && !isLoadingSearch ? (
          <>
            <span className="text-neutral-600">
              Showing users for "{searchValue.current}"
            </span>
            <div className="w-full mt-2">
              {searchResult.map(
                (result: Record<string, any>, resultIdx: number) => (
                  <div className="mb-2" key={resultIdx}>
                    <Card style="bg-teal-600">
                      <div className="w-full flex flex-wrap h-[40px] justify-between items-center px-4">
                        <span className="text-white">{result.login}</span>
                        {!result.isOpen ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 text-white cursor-pointer"
                            onClick={() => handleArrowClick(result.id)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 text-white cursor-pointer"
                            onClick={() => handleArrowClick(result.id)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 15.75l7.5-7.5 7.5 7.5"
                            />
                          </svg>
                        )}
                      </div>
                    </Card>
                    {result.isOpen &&
                      result.listRepo.length &&
                      result.listRepo.map(
                        (repo: Record<string, any>, repoIdx: number) => (
                          <div
                            className={`mt-2 w-10/12 float-right ${
                              repoIdx === result.listRepo.length - 1
                                ? "pb-2"
                                : "pb-0"
                            }`}
                            key={repoIdx}
                          >
                            <Card style="bg-teal-700">
                              <div className="w-full py-2 px-3 flex flex-wrap justify-between">
                                <div className="w-9/12">
                                  <p className="text-neutral-200 sm:text-sm md:text-md">
                                    {repo.name}
                                  </p>
                                  <p className="text-neutral-300/[0.9] mt-2 sm:text-sm md:text-md">
                                    {repo.description}
                                  </p>
                                </div>
                                <div className="w-3/12 flex justify-end">
                                  <p className="text-neutral-200 sm:text-sm md:text-md relative top-[3px]">
                                    {repo.stargazers_count}
                                  </p>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6 text-neutral-200 ml-3"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </Card>
                          </div>
                        )
                      )}
                  </div>
                )
              )}
            </div>
          </>
        ) : !searchResult.length && isLoadingSearch ? (
          <Skeleton count={20} className="w-full h-[40px] mb-1" />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default App;
