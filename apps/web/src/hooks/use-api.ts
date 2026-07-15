import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gql } from '../lib/api';
import type { AuthPayload, User, Event, Device, EventResults, Vote } from '../types';
import { useAuthStore } from '../stores/auth.store';

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken refreshToken userId email name role
    }
  }
`;

const REGISTER_MUTATION = `
  mutation Register($input: CreateUserInput!) {
    register(input: $input) {
      accessToken refreshToken userId email name role
    }
  }
`;

const GOOGLE_AUTH_MUTATION = `
  mutation GoogleAuth($token: String!) {
    googleAuth(token: $token) {
      accessToken refreshToken userId email name role
    }
  }
`;

const EVENTS_QUERY = `
  query Events {
    events {
      _id name location description startTime endTime active totalCoeficiente
    }
  }
`;

const DEVICES_QUERY = `
  query Devices {
    devices {
      _id macAddress label active assignedEvent batteryLevel
    }
  }
`;

const EVENT_RESULTS_QUERY = `
  query EventResults($eventId: String!) {
    eventResults(eventId: $eventId) {
      eventId totalVoters totalVotes quorum
      results { option count percentage coeficiente }
    }
  }
`;

const CAST_VOTE_MUTATION = `
  mutation CastVote($deviceId: String!, $eventId: String!, $vote: VoteOption!) {
    castVote(deviceId: $deviceId, eventId: $eventId, vote: $vote) {
      _id deviceId eventId vote timestamp
    }
  }
`;

const CREATE_EVENT_MUTATION = `
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      _id name location startTime active
    }
  }
`;

const ACTIVATE_EVENT_MUTATION = `
  mutation ActivateEvent($id: String!) {
    activateEvent(id: $id) { _id active }
  }
`;

const END_EVENT_MUTATION = `
  mutation EndEvent($id: String!) {
    endEvent(id: $id) { _id active endTime }
  }
`;

const USERS_QUERY = `
  query Users {
    users { _id name email role active }
  }
`;

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (variables: { input: { email: string; password: string } }) =>
      gql<{ login: AuthPayload }>(LOGIN_MUTATION, variables),
    onSuccess: (data) => login(data.login),
  });
}

export function useRegister() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (variables: {
      input: { name: string; email: string; password: string };
    }) => gql<{ register: AuthPayload }>(REGISTER_MUTATION, variables),
    onSuccess: (data) => login(data.register),
  });
}

export function useGoogleAuth() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (variables: { token: string }) =>
      gql<{ googleAuth: AuthPayload }>(GOOGLE_AUTH_MUTATION, variables),
    onSuccess: (data) => login(data.googleAuth),
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => gql<{ events: Event[] }>(EVENTS_QUERY),
    select: (data) => data.events,
  });
}

export function useDevices() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: () => gql<{ devices: Device[] }>(DEVICES_QUERY),
    select: (data) => data.devices,
  });
}

export function useEventResults(eventId: string | null) {
  return useQuery({
    queryKey: ['eventResults', eventId],
    queryFn: () =>
      gql<{ eventResults: EventResults }>(EVENT_RESULTS_QUERY, { eventId }),
    select: (data) => data.eventResults,
    enabled: !!eventId,
  });
}

export function useCastVote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: {
      deviceId: string;
      eventId: string;
      vote: string;
    }) => gql<{ castVote: Vote }>(CAST_VOTE_MUTATION, variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['eventResults', variables.eventId],
      });
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { input: any }) =>
      gql<{ createEvent: Event }>(CREATE_EVENT_MUTATION, variables),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
}

export function useActivateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string }) =>
      gql<{ activateEvent: Event }>(ACTIVATE_EVENT_MUTATION, variables),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
}

export function useEndEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string }) =>
      gql<{ endEvent: Event }>(END_EVENT_MUTATION, variables),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => gql<{ users: User[] }>(USERS_QUERY),
    select: (data) => data.users,
  });
}
