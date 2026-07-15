import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gql } from '../lib/api';
import type { AuthPayload, User, Event, Device, EventResults, Vote, Role, Permission } from '../types';
import { useAuthStore } from '../stores/auth.store';

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken refreshToken userId email name role permissions approved
    }
  }
`;

const REGISTER_MUTATION = `
  mutation Register($input: CreateUserInput!) {
    register(input: $input) {
      accessToken refreshToken userId email name role permissions approved
    }
  }
`;

const GOOGLE_AUTH_MUTATION = `
  mutation GoogleAuth($token: String!) {
    googleAuth(token: $token) {
      accessToken refreshToken userId email name role permissions approved
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
    users { _id name email active approved role { _id name } }
  }
`;

const CREATE_USER_MUTATION = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) { _id name email active approved role { _id name } }
  }
`;

const UPDATE_USER_ROLE_MUTATION = `
  mutation UpdateUserRole($id: String!, $roleId: String!) {
    updateUserRole(id: $id, roleId: $roleId) { _id name email role { _id name } }
  }
`;

const APPROVE_USER_MUTATION = `
  mutation ApproveUser($id: String!) {
    approveUser(id: $id) { _id name approved active }
  }
`;

const TOGGLE_USER_ACTIVE_MUTATION = `
  mutation ToggleUserActive($id: String!) {
    toggleUserActive(id: $id) { _id name active }
  }
`;

const ROLES_QUERY = `
  query Roles {
    roles { _id name isDefault permissions { _id key label group } }
  }
`;

const PERMISSIONS_QUERY = `
  query Permissions {
    permissions { _id key label group description }
  }
`;

const CREATE_ROLE_MUTATION = `
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) { _id name isDefault permissions { _id key label } }
  }
`;

const UPDATE_ROLE_MUTATION = `
  mutation UpdateRole($id: String!, $input: UpdateRoleInput!) {
    updateRole(id: $id, input: $input) { _id name isDefault permissions { _id key label } }
  }
`;

const DELETE_ROLE_MUTATION = `
  mutation DeleteRole($id: String!) {
    deleteRole(id: $id) { _id name }
  }
`;

const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      accessToken refreshToken userId email name role permissions approved
    }
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

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { input: any }) =>
      gql<{ createUser: User }>(CREATE_USER_MUTATION, variables),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; roleId: string }) =>
      gql<{ updateUserRole: User }>(UPDATE_USER_ROLE_MUTATION, variables),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useApproveUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string }) =>
      gql<{ approveUser: User }>(APPROVE_USER_MUTATION, variables),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string }) =>
      gql<{ toggleUserActive: User }>(TOGGLE_USER_ACTIVE_MUTATION, variables),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => gql<{ roles: Role[] }>(ROLES_QUERY),
    select: (data) => data.roles,
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => gql<{ permissions: Permission[] }>(PERMISSIONS_QUERY),
    select: (data) => data.permissions,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { input: any }) =>
      gql<{ createRole: Role }>(CREATE_ROLE_MUTATION, variables),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; input: any }) =>
      gql<{ updateRole: Role }>(UPDATE_ROLE_MUTATION, variables),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string }) =>
      gql<{ deleteRole: Role }>(DELETE_ROLE_MUTATION, variables),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });
}

export function useRefreshToken() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (variables: { token: string }) =>
      gql<{ refreshToken: AuthPayload }>(REFRESH_TOKEN_MUTATION, variables),
    onSuccess: (data) => login(data.refreshToken),
  });
}
