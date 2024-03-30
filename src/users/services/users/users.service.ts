import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../typeorm/entities/User';
import { Repository } from 'typeorm';
import {
  CreateUserParams,
  CreateUserPostParams,
  CreateUserProfileParams,
} from '../../../utils/types';
import { UpdateUserDto } from '../../../dtos/updateUser.dto';
import { Profile } from '../../../typeorm/entities/Profile';
import { Post } from '../../../typeorm/entities/Post';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  findAllUsers() {
    return this.userRepository.find({
      relations: ['profile', 'posts'],
    });
  }

  findUserById(id: number) {
    const userToFound = this.userRepository.findBy({
      id,
    });
    if (!userToFound)
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    return userToFound;
  }

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({
      ...userDetails,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  async updateUser(id: number, updateUserDetails: UpdateUserDto) {
    return await this.userRepository.update(
      {
        id,
      },
      { ...updateUserDetails, updatedAt: new Date() },
    );
  }

  deleteUser(id: number) {
    const userToDelete = this.userRepository.delete({ id });
    if (!userToDelete)
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    return userToDelete;
  }

  async createUserProfile(
    id: number,
    createUserProfileDetails: CreateUserProfileParams,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new HttpException(
        'User Not Found. Cannot create profile',
        HttpStatus.BAD_REQUEST,
      );

    const newProfile = this.profileRepository.create(createUserProfileDetails);
    user.profile = await this.profileRepository.save(newProfile);
    return this.userRepository.save(user);
  }

  async createUserPost(
    id: number,
    createUserPostDetails: CreateUserPostParams,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new HttpException(
        'User Not Found. Cannot create profile',
        HttpStatus.BAD_REQUEST,
      );

    const newPost = this.postRepository.create({
      ...createUserPostDetails,
      user,
    });
    return this.postRepository.save(newPost);
  }
}
