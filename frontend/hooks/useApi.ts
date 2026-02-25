'use client';

import useSWR from 'swr';
import { API_BASE_URL } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSummary() {
  const { data, error, isLoading } = useSWR(`${API_BASE_URL}/summary`, fetcher);
  return { data, error, isLoading };
}

export function useDissemination() {
  const { data, error, isLoading } = useSWR(`${API_BASE_URL}/dissemination`, fetcher);
  return { data, error, isLoading };
}

export function useInterests() {
  const { data, error, isLoading } = useSWR(`${API_BASE_URL}/interests`, fetcher);
  return { data, error, isLoading };
}

export function useGeography() {
  const { data, error, isLoading } = useSWR(`${API_BASE_URL}/geography`, fetcher);
  return { data, error, isLoading };
}

export function useLearners(page = 1, region = '', search = '') {
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/learners?page=${page}${region ? `&region=${region}` : ''}${search ? `&search=${search}` : ''}`,
    fetcher
  );
  return { data, error, isLoading };
}

export function useLearner(id: string) {
  const { data, error, isLoading } = useSWR(`${API_BASE_URL}/learner/${id}`, fetcher);
  return { data, error, isLoading };
}
