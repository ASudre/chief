import notion from '../services/notion'
import { DatabaseObjectResponse, QueryDatabaseResponse, } from '@notionhq/client/build/src/api-endpoints';

const mealsDatabaseId = 'f9edd00b-ea22-4a1e-9440-fe4e4306bd65';

async function getColumns() {
  const res: DatabaseObjectResponse = await notion.databases.retrieve({
    database_id: mealsDatabaseId,
  })

  const COLUMNS_ORDER_BY_ID = [
    "title",
    "Fp%60M",
    "lpwu",
    "C%5B%3B%60",
  ]

  return Object.entries(res.properties)
    .map(([key, value]) => ({
      key,
      rank: COLUMNS_ORDER_BY_ID.findIndex((v) => v === value.id),
      ...value,
    }))
    .sort((a, b) => a.rank - b.rank)
}

async function getContent() {
  const res: QueryDatabaseResponse = await notion.databases.query({
    database_id: mealsDatabaseId,
  })
  if (!res.results) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  return res.results
}

const TYPES = {
  NUMBER: 'number',
  TITLE: 'title',
  MULTI_SELECT: 'multi_select',
}
function formatContent(value: any) {
  return ({
    [TYPES.NUMBER]: (v: any) => v.number,
    [TYPES.TITLE]: (v: any) => v.title[0]?.plain_text,
    [TYPES.MULTI_SELECT]: (v: any) => v.multi_select
      .map((s: any) => s.name)
      .join(' ')
  }[value.type])?.(value)
}

export default async function Home() {
  const data = await getContent()
  const columns = await getColumns()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((value: any) => (
                <th key={value.id} scope="col" className="px-6 py-3">
                  {value.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((meal: any) => (
              <tr key={meal.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                {columns.map((value) => (
                  <td key={value.key} className="px-6 py-4">
                    {formatContent(meal.properties[value.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
