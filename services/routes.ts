/**
 * This file provides the paths to the pages
 */
import {getWindowUrl, displayRef} from './utils';


export const CREATE_ELECTION = '/admin/new/';
export const BALLOT = '/ballot/';
export const ENDED_VOTE = '/ballot/end';
export const VOTE = '/vote/';
export const RESULTS = '/result/';

export const getUrlVote = (electionRef: string | number, token?: string):  URL => {
  const origin = getWindowUrl();
  if (token)
    return new URL(`/${VOTE}/${displayRef(electionRef)}/${token}`, origin);
  return new URL(`/${VOTE}/${displayRef(electionRef)}`, origin);
}

export const getUrlResults = (electionRef: string | number): URL => {
  const origin = getWindowUrl();
  return new URL(`/${RESULTS}/${displayRef(electionRef)}`, origin);
}

export const getUrlAdmin = (electionRef: string | number, adminToken: string): URL => {
  const origin = getWindowUrl();
  return new URL(`/admin/${displayRef(electionRef)}/${adminToken}`, origin);
}

