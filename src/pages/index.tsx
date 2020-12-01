import React, { useState } from 'react'

import { NextPage } from 'next'

import { Search } from '../core/components/icons/search'

const Page: NextPage = props => {
  const [query, setQuery] = useState<string>('')
  const [rating, setRating] = useState<string>('')

  const [result, setResult] = useState<any>(undefined)

  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const [page, setPage] = useState<number>(0)

  const onSearch = (page: number) => async () => {
    try {
      setErrors([])
      setLoading(true)

      // fail if number is illegal
      if (!Number.isSafeInteger(Number(rating === '' ? '0' : rating))) {
        setErrors(['Rating is not a number!'])
      } else {
        // prepare payload
        const payload = {
          from: page * 10,
          size: 10,
          query: {
            query_string: {
              query: query,
            },
            // bool: {
            //   must: query.split(',').map(keyword => ({
            //     match: {
            //       _all: keyword.trim(),
            //     },
            //   })),
            //   filter: [
            //     {
            //       range: {
            //         satisfaction: {
            //           gt: rating === '' ? 0 : Number(rating),
            //         },
            //       },
            //     },
            //   ],
            // },
          },
        }

        const res = await fetch(
          `http://server.rayriffy.com:9200/game/_search`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        ).then(o => o.json())

        setResult(res)
      }
    } catch (e) {
      console.error(e)
      setResult(undefined)
      setErrors(['Query crashed'])
    } finally {
      setLoading(false)
    }
  }

  console.log(result)

  return (
    <div className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8 space-y-4">
      <div className="flex space-x-2 mt-1 items-center">
        <div className="w-full">
          <input
            disabled={loading}
            type="text"
            name="searchInput"
            id="searchInput"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Find genre..."
            onChange={({ target: { value } }) => {
              setQuery(value)
            }}
          />
        </div>
        <button
          disabled={loading}
          onClick={onSearch(0)}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
      {loading && (
        <div className="mx-auto">
          <div className="w-16 h-16 spinner border-4"></div>
        </div>
      )}
      {errors.length > 0 && (
        <div className="bg-red-500 p-4">
          {errors.map((error, i) => (
            <p key={`error-${i}`}>{error}</p>
          ))}
        </div>
      )}
      {result === undefined ? (
        <div className="text-center text-gray-600 font-bold">No data</div>
      ) : (
        <div className="pt-4 grid grid-cols-2 gap-6">
          {result.hits.hits.map(item => (
            <div className="flex items-center">
              <div
                className="bg-white rounded-md p-4 shadow w-full"
                key={`item-${item._id}`}
              >
                <h1 className="text-sm text-gray-900 uppercase font-bold">
                  {item._source.name}
                </h1>
                <div className="py-2 flex flex-wrap">
                  {item._source.tags.map(tag => (
                    <span
                      className="text-white bg-blue-500 px-2 py-1 m-1 text-xs rounded-md"
                      key={`tag-${item._id}-${tag}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="py-2 text-gray-600 text-xs">
                  {item._source.shortDescription}
                </p>
                <h2 className="text-xl font-extrabold">
                  ${item._source.price}
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Page
