'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  /**
   * Logs the term whenever something changes the input tag
   * @param term a String?
   */
  function handleSearch(term: string) {
    const handleSearch = useDebouncedCallback((term) => {
      console.log(`Searching... ${term}`);
      // helps manipulate the URL query parameters
      const params = new URLSearchParams(searchParams);

      // everytime someone types a new search query
      params.set('page', '1');
      // set parameters based on input; delete params if input is empty
      if (term) {
        params.set('query', term);
      } else {
        params.delete('query');
      }
      // pathname: the current path (like dashboard/invoices)
      //  params.toString(): converts whatever users put inside search bar into a URL-friendly string
      // whole thing updates the URL with the user's search data
      replace(`${pathname}?${params.toString()}`);
    }, 300);
    // now we have the query string!
  }
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        //ensures input field is in sync with URL
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
