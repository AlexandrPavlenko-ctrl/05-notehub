import axios, { type AxiosResponse } from "axios";
import { type Note } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const noteApiClient = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const queryParams: Record<string, string | number> = {
    page: params.page,
    perPage: params.perPage,
  };

  if (params.search && params.search.trim() !== "") {
    queryParams.search = params.search.trim();
  }

  const response: AxiosResponse<FetchNotesResponse> = await noteApiClient.get(
    "/notes",
    {
      params: queryParams,
    },
  );

  return response.data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const response: AxiosResponse<Note> = await noteApiClient.post(
    "/notes",
    payload,
  );
  return response.data;
};

export const deleteNote = async (id: string): Promise<{ id: string }> => {
  const response: AxiosResponse<Note> = await noteApiClient.delete(
    `/notes/${id}`,
  );
  return response.data;
};
